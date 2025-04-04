import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { User } from './user.entity';
import { UpdateUserRequest } from '../ui/request/update-user.request';
import { UserResponse } from '../ui/response/user-response';
import { UpdateUserProfileRequest } from '../ui/request/update-user-profile.request';
import { FetchUsersQuery } from '../application/command/fetch-users.query';

export abstract class IUserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(fetchQuery: FetchUsersQuery): Promise<{ data: User[]; pagination: PaginationResponse }>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract updateProfile(userId: string, updateData: UpdateUserProfileRequest): Promise<User>;
}
