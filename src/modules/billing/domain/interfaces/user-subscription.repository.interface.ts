import { UserSubscription } from '../user-subscription.entity';

export interface IUserSubscriptionRepository {
  create(subscription: Partial<UserSubscription>): Promise<UserSubscription | undefined>;

  markCanceled(subscriptionId: string): Promise<void>;

  findByUserId(userId: string): Promise<UserSubscription | undefined>;
}
