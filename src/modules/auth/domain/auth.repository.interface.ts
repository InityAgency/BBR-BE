import { Role } from 'src/modules/role/domain/role.entity';
import { User } from 'src/modules/user/domain/user.entity';
import { UserResponse } from 'src/modules/user/ui/response/user-response';

export abstract class IAuthRepository {
  abstract findByEmail(email: string): Promise<any>;
  abstract create(userData: Partial<User>): Promise<UserResponse>;
  abstract saveResetToken(userId: string, resetToken: string): Promise<User>;
  abstract findRoleByName(name: string): Promise<Role>;
}
