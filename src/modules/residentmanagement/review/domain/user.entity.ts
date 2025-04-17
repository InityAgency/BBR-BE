import { Model } from 'objection';

export class User extends Model {
  id!: string;
  fullName!: string;
  email!: string;

  static tableName = 'users';
}
