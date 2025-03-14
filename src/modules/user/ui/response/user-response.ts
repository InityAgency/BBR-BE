import { Company } from 'src/modules/company/domain/company.entity';
import { UserBuyer } from '../../domain/user-buyer.entity';

export class UserResponse {
  id: string;
  fullName: string;
  email: string;
  receieveLuxuryInsights?: boolean;
  notifyLatestNews?: boolean;
  notifyMarketTrends?: boolean;
  notifyBlogs?: boolean;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  signupMethod?: string;
  emailVerified?: boolean;
  agreedTerms?: boolean;
  buyer?: UserBuyer;
  company?: Company;
  role?: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(user: UserResponse) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.receieveLuxuryInsights = user.receieveLuxuryInsights;
    this.notifyLatestNews = user.notifyLatestNews;
    this.notifyMarketTrends = user.notifyMarketTrends;
    this.notifyBlogs = user.notifyBlogs;
    this.pushNotifications = user.pushNotifications;
    this.emailNotifications = user.emailNotifications;
    this.signupMethod = user.signupMethod;
    this.emailVerified = user.emailVerified;
    this.agreedTerms = user.agreedTerms;
    this.buyer = user.buyer;
    this.company = user.company;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
