import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/user.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequest } from '../ui/request/create-user.request';
import { Knex } from 'knex';
@Injectable()
export class AuthRepository implements IAuthRepository {
  private tableName = 'users';

  constructor(private readonly knexService: KnexService) {}

  async findByEmail(email: string) {
    let query = this.knexService
      .connection(this.tableName)
      .where({ email })
      .whereNull('users.deleted_at');

    query = this.addUserRelations(query);

    return query.select('users.*', 'role', 'company', 'buyer').first();
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

  private addUserRelations(query: Knex.QueryBuilder) {
    return query
      .leftJoin(
        this.knexService.connection.raw(
          `LATERAL (
            SELECT json_build_object('id', roles.id, 'name', roles.name)::json AS role
            FROM roles 
            WHERE roles.id = users.role_id
          ) role ON TRUE`
        )
      )
      .leftJoin(
        this.knexService.connection.raw(
          `LATERAL (
            SELECT json_build_object(
              'id', companies.id, 
              'name', companies.name, 
              'address', companies.address, 
              'phone_number', companies.phone_number, 
              'website', companies.website, 
              'logo', companies.logo, 
              'contact_person_avatar', companies.contact_person_avatar,
              'contact_person_full_name', companies.contact_person_full_name, 
              'contact_person_job_title', companies.contact_person_job_title, 
              'contact_person_email', companies.contact_person_email, 
              'contact_person_phone_number', companies.contact_person_phone_number, 
              'contact_person_phone_number_country_code', companies.contact_person_phone_number_country_code 
            )::json AS company
            FROM companies 
            WHERE companies.id = users.company_id
          ) company ON TRUE`
        )
      )
      .leftJoin(
        this.knexService.connection.raw(
          `LATERAL (
            SELECT json_build_object(
              'avatar', user_buyers.avatar,
              'budgetRangeFrom', user_buyers.budget_range_from,
              'budgetRangeTo', user_buyers.budget_range_to,
              'phoneNumber', user_buyers.phone_number,
              'preferredContactMethod', user_buyers.preferred_contact_method,
              'currentLocation', json_build_object(
                'id', location.id, 
                'name', location.name,
                'code', location.code
              ),
              'preferredResidenceLocation', json_build_object(
                'id', residence.id, 
                'name', residence.name,
                'code', residence.code
              )
            )::json AS buyer
            FROM user_buyers
            LEFT JOIN countries AS location ON location.id = user_buyers.current_location
            LEFT JOIN countries AS residence ON residence.id = user_buyers.preferred_residence_location
            WHERE user_buyers.user_id = users.id
          ) buyer ON TRUE`
        )
      );
  }
}
