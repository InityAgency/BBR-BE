import { BillingTransaction } from '../billing-transaction.entity';

export abstract class ITransactionRepository {
  abstract create(transaction: Partial<BillingTransaction>): Promise<void>;
  abstract findByUser(userId: string): Promise<BillingTransaction[]>;
}
