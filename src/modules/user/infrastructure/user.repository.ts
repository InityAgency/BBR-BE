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
import { UpdateUserProfileRequest } from '../ui/request/update-user-profile.request';
import { buildUpdatePayload } from 'src/shared/utils/build-update-payload';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { UserMapper } from '../ui/mappers/user.mapper';
import { FetchUsersQuery } from '../application/command/fetch-users.query';

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
  async findAll(fetchQuery: FetchUsersQuery): Promise<{ data: User[]; pagination: PaginationResponse }> {
    const { page, limit, searchQuery } = fetchQuery;
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
      data: data,
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
    const updatedUser = await User.query().patchAndFetchById(userId, updateData);

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
  async updateProfile(userId: string, updateData: UpdateUserProfileRequest): Promise<any> {
    await this.knexService.connection.transaction(async (trx) => {
      await trx('users').where({ id: userId }).update({
        fullName: updateData.fullName,
        notifyBlogs: updateData.notifyBlogs,
        notifyMarketTrends: updateData.notifyMarketTrends,
        pushNotifications: updateData.pushNotifications,
        emailNotifications: updateData.emailNotifications,
        updatedAt: new Date(),
      });

      const isBuyer = await trx('user_buyers').where({ userId: userId }).first();
      if (isBuyer) {
        const buyerUpdatePayload = buildUpdatePayload({
          imageId: updateData.imageId,
          phoneNumber: updateData.phoneNumber,
          phoneNumberCountryCode: updateData.phoneNumber,
          budgetRangeFrom: updateData.budgetRangeFrom,
          budgetRangeTo: updateData.budgetRangeTo,
          currentLocation: updateData.currentLocation,
          preferredContactMethod: updateData.preferredContactMethod,
          preferredResidenceLocation: updateData.preferredResidenceLocation,
        });

        if (Object.keys(buyerUpdatePayload).length) {
          await trx('user_buyers').where({ userId: userId }).update(buyerUpdatePayload);
        }

        if (updateData.unitTypes) {
          await trx('user_buyer_unit_types').where({ userId: userId }).delete();

          if (updateData.unitTypes.length) {
            await trx('user_buyer_unit_types').insert(
              updateData.unitTypes.map((id) => ({
                userId: userId,
                unitTypeId: id,
              }))
            );
          }
        }

        if (updateData.lifestyles) {
          await trx('user_buyer_lifestyles').where({ userId: userId }).delete();

          if (updateData.lifestyles.length) {
            await trx('user_buyer_lifestyles').insert(
              updateData.lifestyles.map((id) => ({
                userId: userId,
                lifestyleId: id,
              }))
            );
          }
        }
      }
    });

    return await this.findById(userId);
  }
}
