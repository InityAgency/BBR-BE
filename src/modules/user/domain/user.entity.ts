import * as bcrypt from 'bcrypt';
import { Model } from 'objection';

export class User extends Model {
  id!: string;
  fullName: string;
  email!: string;
  password!: string;
  signupMethod!: string;
  emailVerified?: boolean;
  status?: 'active' | 'inactive';
  roleId?: string;
  aggreedTerms?: boolean;
  receieveLuxuryInsights?: boolean;
  notifyLatestNews?: boolean;
  notifyMarketTrends: boolean;
  notifyBlogs: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'users';

  async $beforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async $beforeUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    this.updatedAt = new Date();
  }

  static async create(data: Partial<User>): Promise<User> {
    return await User.query().insert(data).returning('*');
  }
}
