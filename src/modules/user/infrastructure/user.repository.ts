import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { UserResponse } from '../ui/response/user-response';
import { UpdateUserRequest } from '../ui/request/update-user.request';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  private readonly tableName = 'users';

  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(user: Partial<User>): Promise<User> {
    const [createdUser] = await this.knexService
      .connection(this.tableName)
      .insert(user)
      .returning('*');

    return createdUser;
  }

  @LogMethod()
  async findById(id: string): Promise<User | null> {
    return this.knexService
      .connection(this.tableName)
      .where('users.id', id)
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

  @LogMethod()
  async findByEmail(email: string): Promise<User | null> {
    return this.knexService
      .connection(this.tableName)
      .where({ email })
      .whereNull('deleted_at')
      .first();
  }

  @LogMethod()
  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: UserResponse[]; pagination: PaginationResponse }> {
    const query = this.knexService
      .connection(this.tableName)
      .whereNull('deleted_at')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .leftJoin('user_buyers', 'users.id', 'user_buyers.user_id')
      .leftJoin('companies', 'users.company_id', 'companies.id')
      .select(
        'users.*',
        this.knexService.connection.raw(
          `
          CASE 
            WHEN users.role_id IS NULL THEN NULL
            ELSE json_build_object('id', roles.id, 'name', roles.name)
          END as role`
        ),
        this.knexService.connection.raw(
          `CASE 
            WHEN user_buyers.user_id IS NULL THEN NULL
            ELSE json_build_object(
              'avatar', user_buyers.avatar,
              'currentLocation', user_buyers.current_location,
              'budgetRangeFrom', user_buyers.budget_range_from,
              'budgetRangeTo', user_buyers.budget_range_to,
              'phoneNumber', user_buyers.phone_number,
              'preferredContactMethod', user_buyers.preferred_contact_method,
              'preferredResidenceLocation', user_buyers.preferred_residence_location
            )
          END as buyer`
        ),
        this.knexService.connection.raw(
          `CASE 
            WHEN users.company_id IS NULL THEN NULL
            ELSE json_build_object(
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
            )
          END as company`
        )
      );

    const paginatedQuery = await applyPagination(query, page, limit);

    const totalQuery = this.knexService.connection('roles').count('* as total').first();

    const [data, totalResult] = await Promise.all([paginatedQuery, totalQuery]);

    return {
      data: data.map((user) => new UserResponse(user)),
      pagination: {
        total: totalResult ? Number(totalResult.total) : 0,
        totalPages: Math.ceil((totalResult ? Number(totalResult.total) : 0) / limit),
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async update(userId: string, updateData: UpdateUserRequest): Promise<User> {
    // return this.knexService.connection.transaction(async (trx) => {

    //   await User.query(trx).findById(userId).patch(updateData.userFields);

    //   // ✅ If the user is a developer, update `user_developers`
    //   if (updateData.developerFields) {
    //     await UserDeveloper.query(trx)
    //       .insert(updateData.developerFields)
    //       .onConflict('user_id') // ✅ Prevents duplicate insert
    //       .merge();
    //   }

    //   // ✅ If the user is a buyer, update `user_buyers`
    //   if (updateData.buyerFields) {
    //     await UserBuyer.query(trx)
    //       .insert(updateData.buyerFields)
    //       .onConflict('user_id')
    //       .merge();
    //   }

    //   return await User.query(trx)
    //     .findById(userId)
    //     .withGraphFetched('[developer, buyer]'); // ✅ Fetch updated relations
    // });

    const [updatedUser] = await this.knexService
      .connection(this.tableName)
      .where({ id: userId })
      .update(updateData)
      .returning('*');

    return updatedUser;
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    // Soft delete
    await this.knexService
      .connection(this.tableName)
      .where('users.id', id)
      .update({ deleted_at: this.knexService.connection.fn.now() });
  }

  @LogMethod()
  async updateUserPreferences(userId: string, updateData: any): Promise<any> {
    // TODO: Update user preferences
    return 'in progress';
  }
}
