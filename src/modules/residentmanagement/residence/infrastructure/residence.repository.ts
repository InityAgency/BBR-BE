import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from '../domain/residence.repository.interface';
import { Residence } from '../domain/residence.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { ResidenceStatusEnum } from '../domain/residence-status.enum';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';

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
      .withGraphFetched(
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country,  mainGallery, secondaryGallery]'
      );
  }

  async delete(id: string): Promise<void> {
    await Residence.query()
      .patch({ deletedAt: new Date(), status: ResidenceStatusEnum.DELETED })
      .where('id', id);
  }

  async findById(id: string): Promise<Residence | undefined> {
    return await Residence.query()
      .findById(id)
      .whereNull('deleted_at')
      .withGraphFetched(
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country, mainGallery, secondaryGallery]'
      );
  }

  async findByName(name: string): Promise<Residence | undefined> {
    throw new Error('Method not implemented.');
  }

  async findAll(
    fetchQuery: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery, status, cityId } = fetchQuery;

    const baseQuery = Residence.query()
      .whereNull('residences.deleted_at')
      .modify((qb) => applyFilters(qb, { status, cityId }, Residence.tableName))
      .joinRelated('city')
      .leftJoinRelated('company')
      .withGraphFetched(
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country, company, mainGallery, secondaryGallery]'
      );

    const columnsToSearch = [
      'residences.name',
      'city.name',
      'company.name',
      'company.contact_person_full_name',
      'company.contact_person_email',
    ];
    const searchableQuery = applySearchFilter(baseQuery.clone(), searchQuery, columnsToSearch);

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
    const mediaIds = gallery.map((item) => item.id);
    const existingMediaIds = await this.knexService
      .connection('media')
      .whereIn('id', mediaIds)
      .pluck('id');

    const invalidIds = mediaIds.filter((id) => !existingMediaIds.includes(id));
    if (invalidIds.length) {
      throw new NotFoundException(`Media not found`);
    }

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
