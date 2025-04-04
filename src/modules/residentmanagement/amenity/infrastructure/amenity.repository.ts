import { Injectable } from '@nestjs/common';
import { Amenity } from '../domain/amenity.entity';
import { IAmenityRepository } from '../domain/amenity.repository.interface';
import { FetchAmenitiesQuery } from '../application/commands/fetch-amenities.query';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applySearchFilter } from 'src/shared/filter/query.filter';

@Injectable()
export class AmenityRepositoryImpl implements IAmenityRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(amenity: Partial<Amenity>): Promise<Amenity | undefined> {
    const amenityData = {
      name: amenity.name,
      description: amenity.description,
      iconId: amenity.icon?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedAmenity = await knex('amenities').insert(amenityData).returning('*');

    return this.findById(insertedAmenity[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<Amenity | undefined> {
    return Amenity.query().findById(id).whereNull('deleted_at').withGraphFetched('[icon]');
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchAmenitiesQuery
  ): Promise<{ data: Amenity[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let query = Amenity.query().whereNull('deleted_at').withGraphFetched('[icon]');

    const columnsToSearchAndSort = ['name', 'description'];
    query = applySearchFilter(query, searchQuery, columnsToSearchAndSort, 'amenities');

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const paginatedAmenities = await applyPagination(query, page, limit);

    const totalResult = (await query.clone().clearSelect().clearOrder()
      .whereNull('deleted_at')
      .count('* as total')
      .first()) as { total: string } | undefined;

    const totalCount = totalResult ? Number(totalResult.total) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: paginatedAmenities,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  @LogMethod()
  async findByName(name: string): Promise<Amenity | undefined> {
    return Amenity.query().findOne({ name }).whereNull('deleted_at');
  }

  @LogMethod()
  async update(id: string, data: Partial<Amenity>): Promise<Amenity | undefined> {
    return Amenity.query().patchAndFetchById(id, data).whereNull('deleted_at');
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Amenity.query().where('id', id).patch({ deletedAt: new Date() });
  }
}
