import { Injectable } from '@nestjs/common';
import { City } from '../domain/city.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { ICityRepository } from '../domain/city.repository.interface';
import { FetchCitiesQuery } from '../application/commands/fetch-cities.query';

@Injectable()
export class CityRepositoryImpl implements ICityRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(city: Partial<City>): Promise<City | undefined> {
    const cityData = {
      name: city.name,
      asciiName: city.asciiName,
      countryId: city.country?.id,
      population: city.population,
      timezone: city.timezone,
      xCoordinate: city.xCoordinate,
      yCoordinate: city.yCoordinate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedCity = await knex('cities').insert(cityData).returning('*');

    return this.findById(insertedCity[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<City | undefined> {
    return City.query().findById(id).whereNull('deleted_at').withGraphFetched('[country]'); // Assuming "country" is a relation to be fetched
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchCitiesQuery
  ): Promise<{ data: City[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = City.query().whereNull('deleted_at').withGraphFetched('[country]'); // Assuming "country" is a relation to be fetched

    const columnsToSearchAndSort = [
      'name',
      'asciiName',
      'population',
      'timezone',
      'xCoordinate',
      'yCoordinate',
    ];
    query = applySearchFilter(query, searchQuery, columnsToSearchAndSort, 'cities');

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const paginatedCities = await applyPagination(query, page, limit);

    const totalResult = (await query.clone().clearSelect().clearOrder().count('* as total').first()) as { total: string } | undefined;

    const totalCount = totalResult ? Number(totalResult.total) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: paginatedCities,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async findByName(name: string): Promise<City | undefined> {
    return City.query().findOne({ name }).whereNull('deleted_at');
  }

  @LogMethod()
  async update(id: string, data: Partial<City>): Promise<City | undefined> {
    return City.query().patchAndFetchById(id, data).whereNull('deleted_at');
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await City.query().deleteById(id);
  }
}
