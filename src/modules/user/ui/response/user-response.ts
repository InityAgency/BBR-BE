export class UserResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  role?: any;

  constructor(user: UserResponse) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
