import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { UserResponse } from '../ui/response/user-response';

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
  ): Promise<{ data: User[]; pagination: PaginationResponse }> {
    const query = this.knexService
      .connection(this.tableName)
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
  async update(user: Partial<User>): Promise<User> {
    const [updatedUser] = await this.knexService
      .connection(this.tableName)
      .where({ id: user.id })
      .update(user)
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
