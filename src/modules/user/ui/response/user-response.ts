export class UserResponse {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  receieveLuxuryInsights?: boolean;
  notifyLatestNews?: boolean;
  notifyMarketTrends: boolean;
  notifyBlogs: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  role?: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(user: UserResponse) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.companyName = user.companyName;
    this.email = user.email;
    this.role = user.role;
    this.receieveLuxuryInsights = user.receieveLuxuryInsights;
    this.notifyLatestNews = user.notifyLatestNews;
    this.notifyMarketTrends = user.notifyMarketTrends;
    this.notifyBlogs = user.notifyBlogs;
    this.pushNotifications = user.pushNotifications;
    this.emailNotifications = user.emailNotifications;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
