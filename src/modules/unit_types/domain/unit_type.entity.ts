import { Model } from 'objection';

export class UnitType extends Model {
  id!: string;
  name!: string;
  created_at!: Date;
  updated_at!: Date;

  static tableName = 'unit_types';
}
