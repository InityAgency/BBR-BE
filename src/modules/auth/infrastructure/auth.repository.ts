import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/user.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { IAuthRepository } from '../domain/auth.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  private tableName = 'users';

  constructor(private readonly knexService: KnexService) {}

  // ✅ Find a user by email
  async findByEmail(email: string) {
    return this.knexService
      .connection(this.tableName)
      .where({ email })
      .whereNull('deleted_at')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .select(
        'users.*',
        this.knexService.connection.raw(
          `
        CASE 
          WHEN users.role_id IS NULL THEN NULL
          ELSE json_build_object('id', roles.id, 'name', roles.name)
        END as role`
        )
      )
      .first();
  }

  // ✅ Create a new user
  async create(userData: Partial<User>) {
    const [user] = await this.knexService
      .connection(this.tableName)
      .insert(userData)
      .returning('*');
    return user;
  }

  // ✅ Save reset token (for forgot password)
  async saveResetToken(userId: string, resetToken: string) {
    const [user] = await this.knexService
      .connection(this.tableName)
      .where({ id: userId })
      .update({ reset_token: resetToken })
      .returning('*');

    return user;
  }
}
