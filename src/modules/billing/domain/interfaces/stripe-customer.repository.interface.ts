import { StripeCustomer } from './stripe-customer.entity';

export interface IStripeCustomerRepository {
  findByUserId(userId: string): Promise<StripeCustomer | undefined>;
  create(input: { userId: string; stripeCustomerId: string }): Promise<StripeCustomer | undefined>;
}
