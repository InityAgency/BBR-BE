import { BillingPaymentMethod } from '../billing-payment-method.entity';

export interface IPaymentMethodRepository {
  create(paymentMethod: Partial<BillingPaymentMethod>): Promise<BillingPaymentMethod | undefined>;
  setDefault(userId: string, methodId: string): Promise<void>;
  delete(paymentMethodId: string): Promise<void>;
  findAllByUser(userId: string): Promise<BillingPaymentMethod[]>;
}
