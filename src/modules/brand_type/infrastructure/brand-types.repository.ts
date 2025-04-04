import { Injectable } from '@nestjs/common';
import { BrandType } from '../domain/brand-type.entity';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchBrandTypesQuery } from '../application/command/fetch-brand-types.query';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { Brand } from '../../brand/domain/brand.entity';
import { BrandStatus } from '../../brand/domain/brand-status.enum';
import { KnexService } from '../../../shared/infrastructure/database/knex.service';

@Injectable()
export class BrandTypesRepository implements IBrandTypesRepository {
  constructor(private readonly knexService: KnexService) {}
  @LogMethod()
  async findAll(
    fetchQuery: FetchBrandTypesQuery
  ): Promise<{ data: BrandType[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = BrandType.query().whereNull('deleted_at').withGraphFetched('brands.[logo]');

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['name', 'description'];
    query = applySearchFilter(query, searchQuery, columnsToSearch, 'brand_types');

    const paginatedBrandTypes = await applyPagination(query, page, limit);

    const totalResult = (await query.clone().clearSelect().clearOrder().count('* as total').first()) as { total: string } | undefined;

    const totalCount = totalResult ? Number(totalResult.total) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: paginatedBrandTypes,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  @LogMethod()
  async create(brandType: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().insert(brandType).returning('*');
  }

  @LogMethod()
  async findByName(name: string): Promise<BrandType | undefined> {
    return await BrandType.query().where({ name }).first();
  }

  @LogMethod()
  async findById(id: string): Promise<BrandType | undefined> {
    return await BrandType.query()
      .findById(id)
      .whereNull('deleted_at')
      .withGraphFetched('brands.[logo]');
  }

  @LogMethod()
  async update(id: string, brandType: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().whereNull('deleted_at').patchAndFetchById(id, brandType);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await BrandType.query()
      .where('id', id)
      .whereNull('deleted_at')
      .patch({ deletedAt: new Date() });
  }
}
