import { Injectable } from '@nestjs/common';
import { Country } from '../domain/country.entity';
import { ICountryRepository } from '../domain/country.repository.interface';
import { FetchCountriesQuery } from '../application/commands/fetch-countries.query';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applySearchFilter } from 'src/shared/filter/query.filter';

@Injectable()
export class CountryRepositoryImpl implements ICountryRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(country: Partial<Country>): Promise<Country | undefined> {
    const countryData = {
      name: country.name,
      code: country.code,
      capital: country.capital,
      currency_code: country.currencyCode,
      currency_name: country.currencyName,
      currency_symbol: country.currencySymbol,
      flag: country.flag,
      subregion: country.subregion,
      tld: country.tld,
      continentId: country.continent?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedCountry = await knex('countries').insert(countryData).returning('*');

    return this.findById(insertedCountry[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<Country | undefined> {
    return Country.query()
      .findById(id)
      .whereNull('deleted_at')
      .withGraphFetched('[continent, phoneCodes]');
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchCountriesQuery
  ): Promise<{ data: Country[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let query = Country.query().whereNull('deleted_at').withGraphFetched('[continent, phoneCodes]');

    const columnsToSearchAndSort = [
      'name',
      'code',
      'capital',
      'currency_code',
      'currency_name',
      'currency_symbol',
      'subregion',
      'tld',
    ];
    query = applySearchFilter(query, searchQuery, columnsToSearchAndSort, 'countries');

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(query, page, limit);

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

  @LogMethod()
  async findByName(name: string): Promise<Country | undefined> {
    return Country.query().findOne({ name }).whereNull('deleted_at');
  }

  @LogMethod()
  async update(id: string, data: Partial<Country>): Promise<Country | undefined> {
    return Country.query().patchAndFetchById(id, data).whereNull('deleted_at');
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Country.query().deleteById(id);
  }
}
