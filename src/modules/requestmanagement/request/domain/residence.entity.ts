import { Model } from 'objection';

export class Residence extends Model {
  id!: string;
  developerId!: string;

  static tableName = 'residences';
}
