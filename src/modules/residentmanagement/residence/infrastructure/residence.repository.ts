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
import { ResidenceHighlightedAmenity } from '../domain/residence-highlighted-amenities.entity';

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
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country,  mainGallery,  amenities, secondaryGallery, units]'
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
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country, mainGallery, secondaryGallery, highlightedAmenities.amenity, amenities.[icon, featuredImage], units.featureImage, totalScores.[rankingCategory]]'
      );
  }

  async findBySlug(slug: string): Promise<Residence | undefined> {
    return await Residence.query()
      .whereNull('deleted_at')
      .findOne({ slug })
      .withGraphFetched(
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country, mainGallery, secondaryGallery, highlightedAmenities.amenity.[icon, featuredImage], amenities.[icon, featuredImage], units.featureImage, totalScores.[rankingCategory]]'
      );
  }

  async findByName(name: string): Promise<Residence | undefined> {
    throw new Error('Method not implemented.');
  }

  async findAll(
    fetchQuery: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      searchQuery: searchQuery,
      status,
      developmentStatus,
      cityId,
      countryId,
      brandId,
      address,
    } = fetchQuery;

    const baseQuery = Residence.query()
      .whereNull('residences.deleted_at')
      .modify((qb) =>
        applyFilters(
          qb,
          { status, cityId, brandId, countryId, address, developmentStatus },
          Residence.tableName
        )
      )
      .joinRelated('[city, country]')
      .leftJoinRelated('company')
      .leftJoinRelated('brand')
      .modify((qb) => {
        if (fetchQuery.continentId) {
          qb.where('country.continentId', fetchQuery.continentId);
        }
      })
      .withGraphFetched(
        '[videoTour, featuredImage, brand.logo, keyFeatures, city, country, company, mainGallery, secondaryGallery, highlightedAmenities.amenity, amenities.[icon, featuredImage], units.featureImage, totalScores.[rankingCategory]]'
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
      const allowedColumns = ['name', 'brand.name', 'createdAt', 'updatedAt'];
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

  async addHighlightedAmenity(data: {
    residenceId: string;
    amenityId: string;
    description?: string;
    featuredImageId?: string;
    order?: number;
  }) {
    await ResidenceHighlightedAmenity.query().insert({
      residenceId: data.residenceId,
      amenityId: data.amenityId,
      order: data.order,
    });
  }

  async clearHighlightedAmenities(residenceId: string): Promise<void> {
    await ResidenceHighlightedAmenity.query().where('residence_id', residenceId).delete();
  }

  async findCriteriaForResidenceCategory(residenceId: string, rankingCategoryId: string) {
    const knex = this.knexService.connection;

    const results = await knex('ranking_category_criteria as rcc')
      .select(['rc.id', 'rc.name', 'rcc.weight', 'rrcs.score'])
      .join('ranking_criteria as rc', 'rc.id', 'rcc.ranking_criteria_id')
      .leftJoin('residence_ranking_criteria_scores as rrcs', function () {
        this.on('rrcs.ranking_criteria_id', '=', 'rcc.ranking_criteria_id')
          .andOn('rrcs.ranking_category_id', '=', 'rcc.ranking_category_id')
          .andOn('rrcs.residence_id', '=', knex.raw('?', [residenceId]));
      })
      .where('rcc.ranking_category_id', rankingCategoryId)
      .orderBy('rc.name', 'asc');

    return results;
  }
}
