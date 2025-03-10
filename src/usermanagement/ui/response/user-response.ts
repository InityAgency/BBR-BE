import { User } from 'src/usermanagement/domain/user.entity';

export class UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
    this.role = user.role;
  }
}
