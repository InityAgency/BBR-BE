import { Model } from 'objection';
import { BrandType } from './brand-type.enum';
import { BrandStatus } from './brand-status.enum';

export class Brand extends Model {
  id!: string;
  name!: string;
  description!: string;
  type!: BrandType;
  status!: BrandStatus;
  registeredAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'brands';

  static get relationMappings() {
    return {};
  }

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static async create(data: Partial<Brand>): Promise<Brand> {
    return await Brand.query().insert(data).returning('*');
  }
}
