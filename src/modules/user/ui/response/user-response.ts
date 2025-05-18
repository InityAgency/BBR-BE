import { Company } from 'src/modules/company/domain/company.entity';
import { UserBuyer } from '../../domain/user-buyer.entity';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { CompanyResponse } from './company.response';
import { RoleResponse } from 'src/modules/role/ui/response/role-response';

export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly receiveLuxuryInsights?: boolean,
    public readonly notifyLatestNews?: boolean,
    public readonly notifyMarketTrends?: boolean,
    public readonly notifyBlogs?: boolean,
    public readonly pushNotifications?: boolean,
    public readonly emailNotifications?: boolean,
    public readonly signupMethod?: string,
    public readonly emailVerified?: boolean,
    public readonly agreedTerms?: boolean,
    public readonly status?: UserStatusEnum,
    public readonly buyer?: UserBuyer | null,
    public readonly company?: CompanyResponse | null,
    public readonly role?: RoleResponse | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date
  ) {}
}
