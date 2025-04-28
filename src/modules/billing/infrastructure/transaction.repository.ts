import { Injectable } from '@nestjs/common';
import { BillingTransaction } from '../domain/billing-transaction.entity';
import { ITransactionRepository } from '../domain/interfaces/transaction.repository.interface';
@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  async create(transaction: Partial<BillingTransaction>): Promise<void> {
    await BillingTransaction.query().insert({
      userId: transaction.userId,
      stripePaymentIntentId: transaction.stripePaymentIntentId,
      stripeInvoiceId: transaction.stripeInvoiceId,
      stripeProductId: transaction.stripeProductId,
      stripePriceId: transaction.stripePriceId,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
    });
  }

  async findByUser(userId: string) {
    return await BillingTransaction.query().where('user_id', userId);
  }
}
