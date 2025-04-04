import { Injectable } from '@nestjs/common';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { BrandStatus } from '../domain/brand-status.enum';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class BrandRepositoryImpl implements IBrandRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(brand: Partial<Brand>): Promise<Brand | undefined> {
    const insertedBrand = await this.knexService.connection('brands').insert(brand).returning('*');

    return this.findById(insertedBrand[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<Brand | undefined> {
    return await Brand.query()
      .findById(id)
      .whereNull('deleted_at')
      .withGraphFetched('[brandType, logo]');
  }

  @LogMethod()
  async findByName(name: string): Promise<Brand | undefined> {
    return await Brand.query()
      .where({ name })
      .whereNull('deleted_at')
      .withGraphFetched('logo')
      .first();
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let baseQuery = Brand.query().whereNull('deleted_at').withGraphFetched('[brandType, logo]');

    // check if brandTypeId is valid
    if (fetchQuery.brandTypeId && isValidUUID(fetchQuery.brandTypeId)) {
      baseQuery = baseQuery.where('brand_type_id', fetchQuery.brandTypeId);
    }

    // filter by status
    if (fetchQuery.status) {
      baseQuery = baseQuery.where('status', fetchQuery.status);
    }

    // sort
    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'status', 'registered_at', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        baseQuery = baseQuery.orderBy(sortBy, sortOrder);
      }
    }

    // search
    const columnsToSearch = ['name', 'description', 'status'];
    baseQuery = applySearchFilter(baseQuery, searchQuery, columnsToSearch, 'brands');

    // now paginate
    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      baseQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async update(id: string, updateData: Partial<Brand>): Promise<Brand | undefined> {
    const result = await Brand.query().whereNull('deleted_at').patchAndFetchById(id, updateData);

    return this.findById(result.id);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Brand.query()
      .where('id', id)
      .patch({ deletedAt: new Date(), status: BrandStatus.DELETED });
  }
}
