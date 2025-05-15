import { User } from '../../domain/user.entity';
import { UserResponse } from '../response/user-response';
import { CompanyMapper } from './company.mapper';

export class UserMapper {
  public toResponse(user: User): UserResponse {
    return new UserResponse(
      user.id,
      user.fullName,
      user.email,
      user.receiveLuxuryInsights,
      user.notifyLatestNews,
      user.notifyMarketTrends,
      user.notifyBlogs,
      user.pushNotifications,
      user.emailNotifications,
      user.signupMethod,
      user.emailVerified,
      user.agreedTerms,
      user.status,
      user.buyer,
      user.company ? CompanyMapper.toResponse(user.company) : null,
      user.role,
      user.createdAt,
      user.updatedAt,
      user.deletedAt
    );
  }
}
