import { Injectable } from '@nestjs/common';
import { ILifestyleRepository } from '../domain/lifestyle.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { Lifestyle } from '../domain/lifestyle.entity';
import { FetchLifestyleQuery } from '../application/command/fetch-lifestyle.query';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

@Injectable()
export class LifestyleRepositoryIml implements ILifestyleRepository {
  constructor(private readonly knexService: KnexService) {}

  async findAll(
    fetchQuery: FetchLifestyleQuery
  ): Promise<{ data: Lifestyle[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = Lifestyle.query().withGraphFetched('[image]');

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['name'];
    query = applySearchFilter(query, searchQuery, columnsToSearch, 'lifestyles');

    const paginatedBrands = await applyPagination(query, page, limit);

    const totalResult = (await query.count('* as total').first()) as { total: string } | undefined;

    const totalCount = totalResult ? Number(totalResult.total) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: paginatedBrands,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  async findById(id: string): Promise<Lifestyle | undefined> {
    return await Lifestyle.query().findById(id).withGraphFetched('[image]');
  }

  async findByName(name: string): Promise<Lifestyle | undefined> {
    return await Lifestyle.query().findOne({ name });
  }

  async create(lifestyle: Partial<Lifestyle>): Promise<Lifestyle> {
    return await Lifestyle.create(lifestyle);
  }

  async update(id: string, data: Partial<Lifestyle>): Promise<Lifestyle | undefined> {
    return await Lifestyle.query().patchAndFetchById(id, data);
  }

  async delete(id: string): Promise<any> {
    return await Lifestyle.query().deleteById(id);
  }
}
