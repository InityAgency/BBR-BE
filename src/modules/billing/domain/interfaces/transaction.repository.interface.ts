import { BillingTransaction } from '../billing-transaction.entity';

export interface ITransactionRepository {
  create(transaction: Partial<BillingTransaction>): Promise<void>;

  findByUser(userId: string): Promise<BillingTransaction[]>;
}
