import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/user.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequest } from '../ui/request/create-user.request';
@Injectable()
export class AuthRepository implements IAuthRepository {
  private tableName = 'users';

  constructor(private readonly knexService: KnexService) {}

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

  findRoleByName(name: string) {
    return this.knexService.connection('roles').where({ name: name.toLowerCase() }).first();
  }

  async create(userData: Partial<CreateUserRequest>) {
    return this.knexService.connection.transaction(async (trx) => {
      const [user] = await trx(this.tableName).insert(userData).returning('*');

      // ✅ If the user is a developer, create a company
      const role = await trx('roles')
        .where({ name: 'developer', id: user.roleId })
        .select('id', 'name')
        .first();

      if (role) {
        // ✅ Create a company for developers
        const companyId = uuidv4();
        await trx('companies').insert({
          id: companyId,
          name: userData.companyName || `${userData.fullName}'s Company`,
          address: null,
          phone_number: null,
          website: null,
        });

        // ✅ Link developer user to the created company
        await trx('users').where({ id: user.id }).update({ company_id: companyId });

        return { ...user, company_id: companyId };
      }

      return user;
    });
  }

  async saveResetToken(userId: string, resetToken: string) {
    const [user] = await this.knexService
      .connection(this.tableName)
      .where({ id: userId })
      .update({ reset_token: resetToken })
      .returning('*');

    return user;
  }
}
