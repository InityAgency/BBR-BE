import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { BrandStatus } from '../domain/brand-status.enum';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
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
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = Brand.query().whereNull('deleted_at').withGraphFetched('[brandType, logo]');

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'status', 'registered_at', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['name', 'description', 'status'];
    query = applySearchFilter(query, searchQuery, columnsToSearch, 'brands');

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

  @LogMethod()
  async update(id: string, updateData: Partial<Brand>): Promise<Brand | undefined> {
    const result = await Brand.query().patchAndFetchById(id, updateData).whereNull('deleted_at');

    return this.findById(result.id);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Brand.query()
      .where('id', id)
      .patch({ deletedAt: new Date(), status: BrandStatus.DELETED });
  }
}
