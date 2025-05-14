import { Company } from 'src/modules/company/domain/company.entity';
import { UserBuyer } from '../../domain/user-buyer.entity';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly receieveLuxuryInsights?: boolean,
    public readonly notifyLatestNews?: boolean,
    public readonly notifyMarketTrends?: boolean,
    public readonly notifyBlogs?: boolean,
    public readonly pushNotifications?: boolean,
    public readonly emailNotifications?: boolean,
    public readonly signupMethod?: string,
    public readonly emailVerified?: boolean,
    public readonly agreedTerms?: boolean,
    public readonly status?: UserStatusEnum,
    public readonly buyer?: UserBuyer,
    public readonly company?: Company,
    public readonly role?: any,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date
  ) {}
}
