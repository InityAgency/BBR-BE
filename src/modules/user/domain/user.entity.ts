import * as bcrypt from 'bcrypt';
import { Model } from 'objection';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { UserBuyer } from './user-buyer.entity';
import { Company } from 'src/modules/company/domain/company.entity';
import { Role } from 'src/modules/role/domain/role.entity';
import { Lifestyle } from 'src/modules/lifestyles/domain/lifestyle.entity';
import { UnitType } from 'src/modules/unit_type/domain/unit_type.entity';

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
  buyer?: UserBuyer;
  company?: Company;
  role?: Role;
  lifestyles?: Lifestyle[];
  unitTypes: UnitType[];
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  companyName?: string; // need in case for developer

  static tableName = 'users';

  static relationMappings = {
    unitTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: () => UnitType,
      join: {
        from: 'users.id',
        through: {
          from: 'users_unit_types.userId',
          to: 'users_unit_types.unitTypeId',
        },
        to: 'unit_types.id',
      },
    },
  };

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
