import { Controller, Post, Headers, Req, Res, HttpStatus, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { Stripe } from 'stripe';
import { OneTimePurchaseService } from '../application/services/one-time-purchase.service';
import { SubscriptionService } from '../application/services/subscription.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly oneTimePurchaseService: OneTimePurchaseService,
    private readonly subscriptionService: SubscriptionService
    // private readonly invoicePaidHandler: HandleInvoicePaidCommandHandler,
    // private readonly invoicePaymentFailedHandler: HandleInvoicePaymentFailedCommandHandler,
  ) {}

  @Post()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string
  ) {
    let event: Stripe.Event;

    try {
      const payload = req.rawBody;
      event = this.stripeService.getEventFromWebhookPayload(signature, payload!);
    } catch (err) {
      console.error('Invalid Stripe webhook signature.', err);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    console.log('event', event);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Webook session', session);

        if (session.mode === 'payment') {
          await this.oneTimePurchaseService.handleCompletedSession(session.id);
        } else if (session.mode === 'subscription') {
          await this.subscriptionService.handleCheckoutSessionCompleted(session);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        // await this.invoicePaidHandler.handle(invoice);
        console.log('invoice', invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('invoice failed', invoice);
        // await this.invoicePaymentFailedHandler.handle(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return res.status(HttpStatus.OK).send({ received: true });
  }
}
