import * as bcrypt from 'bcrypt';
import { Model } from 'objection';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

export class User extends Model {
  id!: string;
  fullName: string;
  email!: string;
  password!: string;
  signupMethod!: SignupMethodEnum;
  emailVerified?: boolean;
  status?: UserStatusEnum;
  roleId?: string;
  agreedTerms?: boolean;
  receiveLuxuryInsights?: boolean;
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
