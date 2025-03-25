import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { User } from './user.entity';
import { UpdateUserRequest } from '../ui/request/update-user.request';
import { UserResponse } from '../ui/response/user-response';

export abstract class IUserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(
    page: number,
    limit: number
  ): Promise<{ data: UserResponse[]; pagination: PaginationResponse }>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract updateUserPreferences(userId: string, updateData: any): Promise<any>;
}
