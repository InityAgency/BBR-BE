import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { UpdateUserRequest } from '../ui/request/update-user.request';
import { UserResponse } from '../ui/response/user-response';
import {
  buildUnitTypesJoin,
  buildLifestylesJoin,
  buildRoleJoin,
  buildCompanyJoin,
  buildBuyerJoin,
} from 'src/shared/user-query';

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
    const knex = this.knexService.connection;

    let query = this.knexService
      .connection(this.tableName)
      .where('users.id', id)
      .leftJoin(buildUnitTypesJoin(knex))
      .leftJoin(buildLifestylesJoin(knex))
      .leftJoin(buildRoleJoin(knex))
      .leftJoin(buildCompanyJoin(knex))
      .leftJoin(buildBuyerJoin(knex));

    return query.select('users.*', 'role', 'company', 'buyer', 'unitTypes', 'lifestyles').first();
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
    const knex = this.knexService.connection;

    let query = this.knexService
      .connection(this.tableName)
      .whereNull('deleted_at')
      .leftJoin(buildUnitTypesJoin(knex))
      .leftJoin(buildLifestylesJoin(knex))
      .leftJoin(buildRoleJoin(knex))
      .leftJoin(buildCompanyJoin(knex))
      .leftJoin(buildBuyerJoin(knex));

    query.select('users.*', 'role', 'company', 'buyer', 'unitTypes');

    const paginatedQuery = await applyPagination(query, page, limit);

    const totalQuery = this.knexService
      .connection(this.tableName)
      .whereNull('deleted_at')
      .count('* as total')
      .first();

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
