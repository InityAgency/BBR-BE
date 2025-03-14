import { Model } from 'objection';

export class Country extends Model {
  id!: string;
  name!: string;

  static tableName = 'countries';
}
