import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { EntityMedia } from 'src/modules/media/domain/entity-media.entity';
@Injectable()
export class BrandRepositoryImpl implements IBrandRepository {
  @LogMethod()
  async create(brand: Partial<Brand>): Promise<Brand> {
    return await Brand.create(brand);
  }

  @LogMethod()
  async findById(id: string): Promise<Brand | undefined> {
    return await Brand.query().findById(id).whereNull('deleted_at');
  }

  @LogMethod()
  async findByName(name: string): Promise<Brand | undefined> {
    return await Brand.query().where({ name }).whereNull('deleted_at').first();
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder } = fetchQuery;

    console.log(Brand.relationMappings);

    let query = Brand.query().whereNull('deleted_at').withGraphFetched('[brandType, logo]');

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'status', 'registered_at', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const paginatedBrands = await applyPagination(query, page, limit);

    const totalResult = (await Brand.query()
      .whereNull('deleted_at')
      .count('* as total')
      .first()) as { total: string } | undefined;

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
  async update(id: string, updateData: Partial<Brand>): Promise<Brand> {
    return await Brand.query().patchAndFetchById(id, updateData).whereNull('deleted_at');
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Brand.query().where('id', id).patch({ deletedAt: new Date() });
  }

  async getLogo(brandId: string) {
    return await EntityMedia.query()
      .select('mediaId')
      .where({ entityId: brandId, entityType: 'brands', mediaType: 'logo' })
      .first();
  }

  async updateLogo(brandId: string, mediaId: string) {
    // Remove old logo (handled in controller before calling this method)
    await EntityMedia.query()
      .delete()
      .where({ entityId: brandId, entityType: 'brands', mediaType: 'logo' });

    const media = {
      entityId: brandId,
      entityType: 'brands',
      mediaId,
      mediaType: 'logo',
      order: 0,
      highlighted: true,
    };

    // Attach new logo
    await EntityMedia.query().insert(media);
  }
}
