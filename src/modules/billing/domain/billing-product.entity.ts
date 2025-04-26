import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { Model } from 'objection';

export class BillingProduct extends Model {
  id!: number;
  name!: string;
  featureKey!: string;
  type!: BillingProductTypeEnum;
  productId!: string;
  priceId!: string;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'billing_products';

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
