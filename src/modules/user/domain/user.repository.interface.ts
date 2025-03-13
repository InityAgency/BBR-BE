import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { User } from './user.entity';

export abstract class IUserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(
    page: number,
    limit: number
  ): Promise<{ data: User[]; pagination: PaginationResponse }>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract updateUserPreferences(userId: string, updateData: any): Promise<any>;
}
