import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';
import { BillingProduct } from './billing-product.entity';
import { StripeCustomer } from './stripe-customer.entity';
import { Model, RelationMappings } from 'objection';

export class UserSubscription extends Model {
  id!: string;
  userId!: string;
  productId!: string;
  subscriptionId!: string;
  currentPeriodEnd!: Date;
  status!: SubscriptionStatusEnum;
  createdAt!: Date;
  updatedAt!: Date;

  product?: BillingProduct;
  customer?: StripeCustomer;

  static tableName = 'user_subscriptions';

  static relationMappings: RelationMappings = {
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => BillingProduct,
      join: {
        from: 'user_subscriptions.productId',
        to: 'billing_products.id',
      },
    },
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => StripeCustomer,
      join: {
        from: 'user_subscriptions.userId',
        to: 'stripe_customers.userId',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
