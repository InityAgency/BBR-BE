import { Injectable } from '@nestjs/common';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { IUserSubscriptionRepository } from '../../domain/interfaces/user-subscription.repository.interface';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import { StripeCustomerService } from './stripe-customer.service';
import { IEmailRepository } from 'src/modules/email/domain/email.repository.interface';
import { ITransactionRepository } from '../../domain/interfaces/transaction.repository.interface';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly stripe: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly subscriptionRepo: IUserSubscriptionRepository,
    private readonly productRepo: IBillingProductRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly emailRepository: IEmailRepository
  ) {}

  async createCheckout(
    userId: string,
    priceId: string,
    email: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, email);

    return this.stripe.createCheckoutSession({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata: { userId },
      line_items: [{ price: priceId, quantity: 1 }],
    });
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const subscriptionId = session.subscription as string;
    const userId = session.metadata?.userId;
    if (!userId || !subscriptionId) return;

    const sub: any = await this.stripe.getSubscription(subscriptionId);

    const items = sub.items?.data;
    if (!items?.length) return;

    const priceId = items[0]?.price?.id;
    if (!priceId) return;

    const product = await this.productRepo.findByBillingPriceId(priceId);
    if (!product) return;

    const periodEndUnix = sub.current_period_end ?? items[0]?.current_period_end;
    if (!periodEndUnix) return;

    await this.subscriptionRepo.create({
      userId,
      productId: product.id,
      subscriptionId: sub.id,
      currentPeriodEnd: new Date(periodEndUnix * 1000),
      status: sub.status,
    });
  }

  async handleInvoicePaid(subscriptionId: string): Promise<void> {
    const sub: any = await this.stripe.getSubscription(subscriptionId);

    const userId = sub.metadata?.userId;
    if (!userId) return;

    const items = sub.items?.data;
    if (!items?.length) return;

    const priceId = items[0]?.price?.id;
    if (!priceId) return;

    const product = await this.productRepo.findByBillingPriceId(priceId);
    if (!product) return;

    const periodEndUnix = sub.current_period_end ?? items[0]?.current_period_end;
    if (!periodEndUnix) return;

    await this.subscriptionRepo.create({
      userId,
      productId: product.id,
      subscriptionId: sub.id,
      currentPeriodEnd: new Date(periodEndUnix * 1000),
      status: sub.status,
    });

    const latestInvoiceId = sub.latest_invoice;
    if (latestInvoiceId) {
      const invoice = await this.stripe.getInvoice(latestInvoiceId);
      const pdfUrl = invoice.invoice_pdf;
      const htmlUrl = invoice.hosted_invoice_url;

      await this.transactionRepo.create({
        userId,
        stripePaymentIntentId: (invoice as any).payment_intent,
        stripeInvoiceId: invoice.id,
        stripeProductId: product.stripeProductId,
        stripePriceId: priceId,
        type: BillingProductTypeEnum.SUBSCRIPTION,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status!, // 'paid'
      });

      await this.emailRepository.sendInvoice(
        'g8M5H@example.com',
        'subject invoice',
        pdfUrl!,
        htmlUrl!
      );
    }
  }

  //   TODO PREBACITI U HANDLE
  async handleSubscriptionCanceled(subscriptionId: string) {
    const sub = await this.stripe.getSubscription(subscriptionId);
    await this.subscriptionRepo.markCanceled(sub.id);
  }
}
