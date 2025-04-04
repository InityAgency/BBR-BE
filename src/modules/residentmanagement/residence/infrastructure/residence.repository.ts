import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IResidenceRepository } from '../domain/residence.repository.interface';
import { Residence } from '../domain/residence.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { applyPagination } from 'src/shared/utils/pagination.util';

@Injectable()
export class ResidenceRepository implements IResidenceRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(residence: Partial<Residence>): Promise<Residence | undefined> {
    return await this.knexService.connection.transaction(async (trx) => {
      const created = await Residence.create(residence);

      if (!created) {
        throw new InternalServerErrorException('Residence not created');
      }

      return created;
    });
  }

  async update(id: string, data: Partial<Residence>): Promise<Residence | undefined> {
    return await Residence.query()
      .patchAndFetchById(id, data)
      .withGraphFetched('[videoTour, featuredImage, brand.logo, keyFeatures, city, country]');
  }
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<Residence | undefined> {
    return await Residence.query()
      .findById(id)
      .whereNull('deleted_at')
      .withGraphFetched('[videoTour, featuredImage, brand.logo, keyFeatures, city, country]');
  }
  async findByName(name: string): Promise<Residence | undefined> {
    throw new Error('Method not implemented.');
  }
  async findAll(
    fetchQuery: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery, status } = fetchQuery;

    const baseQuery = Residence.query()
      .whereNull('deleted_at')
      .modify((qb) => {
        if (status) {
          qb.where('status', status);
        }
      })
      .withGraphFetched('[videoTour, featuredImage, brand.logo, keyFeatures, city, country]');

    const columnsToSearch = ['name'];
    const searchableQuery = applySearchFilter(
      baseQuery.clone(),
      searchQuery,
      columnsToSearch,
      'residences'
    );

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        searchableQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      searchableQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  async syncOrderedMediaGallery(
    residenceId: string,
    gallery: { id: string; order: number }[],
    type: 'mainGallery' | 'secondaryGallery'
  ) {
    await this.knexService
      .connection('residence_media')
      .where({ residence_id: residenceId, media_type: type })
      .delete();

    if (gallery?.length) {
      const rows = gallery.map((item) => ({
        residence_id: residenceId,
        media_id: item.id,
        media_type: type,
        order: item.order,
      }));

      await this.knexService.connection('residence_media').insert(rows);
    }
  }
}
