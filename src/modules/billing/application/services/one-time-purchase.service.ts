import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { TransactionStatusEnum } from 'src/shared/types/transaction-status.enum';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import { ITransactionRepository } from '../../domain/interfaces/transaction.repository.interface';
import { IStripeCustomerRepository } from '../../domain/interfaces/stripe-customer.repository.interface';
import { StripeCustomerService } from './stripe-customer.service';
import { IEmailRepository } from 'src/modules/email/domain/email.repository.interface';
import Stripe from 'stripe';

@Injectable()
export class OneTimePurchaseService {
  constructor(
    private readonly stripe: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly productRepo: IBillingProductRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly emailRepository: IEmailRepository
  ) {}

  async createCheckout(
    userId: string,
    priceId: string,
    email: string,
    successUrl: string,
    cancelUrl: string,
    metadata: Record<string, string>
  ) {
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, email);

    return await this.stripe.createCheckoutSession({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata: {
        userId,
        ...metadata,
      },
      line_items: [{ price: priceId, quantity: 1 }],
    });
  }

  async handleCompletedSession(sessionId: string) {
    const session = await this.stripe.getCheckoutSession(sessionId, {
      expand: [
        'line_items',
        'customer',
        'payment_intent',
        'subscription',
        'payment_intent.payment_method',
      ],
    });

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const userId = session.metadata?.userId;

    if (!userId) throw new InternalServerErrorException('Missing userId in session metadata');
    if (!session.line_items?.data?.length)
      throw new InternalServerErrorException('No line items found in session');

    const priceId = session.line_items.data[0]?.price?.id;
    if (!priceId) throw new InternalServerErrorException('Missing price ID in line item');

    const product = await this.productRepo.findByBillingPriceId(priceId);
    if (!product) throw new NotFoundException('Product not found for provided priceId');

    const invoiceId = (session as any).invoice as string | undefined;

    if (invoiceId) {
      console.log('invoice found', invoiceId);
      const invoice = await this.stripe.getInvoice(invoiceId);
      const pdfUrl = invoice.invoice_pdf;
      const htmlUrl = invoice.hosted_invoice_url;

      await this.transactionRepo.create({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        stripeProductId: product.stripeProductId,
        stripePriceId: priceId,
        type: BillingProductTypeEnum.ONE_TIME,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'USD',
        status: TransactionStatusEnum.SUCCESS,
      });

      await this.emailRepository.sendInvoice(
        'g8M5H@example.com',
        'subject invoice',
        pdfUrl!,
        htmlUrl!
      );
    } else {
      console.log('No invoice found');

      console.log('paymentIntentId', paymentIntent.id);
      console.log('product.stripeProductId', product.stripeProductId);
      console.log('priceId', priceId);
      console.log(userId);

      await this.transactionRepo.create({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        stripeProductId: product.stripeProductId,
        stripePriceId: priceId,
        type: BillingProductTypeEnum.ONE_TIME,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'USD',
        status: TransactionStatusEnum.SUCCESS,
      });
    }
  }
}
