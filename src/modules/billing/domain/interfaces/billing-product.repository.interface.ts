import { BillingProduct } from '../billing-product.entity';

export interface IBillingProductRepository {
  findByBillingPriceId(priceId: string): Promise<BillingProduct | undefined>;
  findByFeatureKey(key: string): Promise<BillingProduct | undefined>;
  getActiveProducts(): Promise<BillingProduct[]>;
}
