import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { ContinentResponse } from '../../continent/ui/response/continent.response';
import { PhoneCode } from '../../phone_code/domain/phone-code.entity';
import { PhoneCodeResponse } from '../../phone_code/ui/response/phone-code.response';
import { CreateCountryCommand } from '../application/commands/create-country.command';
import { FetchCountriesQuery } from '../application/commands/fetch-countries.query';
import { UpdateCountryCommand } from '../application/commands/update-country.command';
import { CreateCountryCommandHandler } from '../application/handler/create-country.command.handler';
import { DeleteCountryCommandHandler } from '../application/handler/delete-country.command.handler';
import { UpdateCountryCommandHandler } from '../application/handler/update-country.command.handler';
import { FetchCountriesCommandQuery } from '../application/query/fetch-countries.command.query';
import { FindCountryByIdCommandQuery } from '../application/query/find-country-by-id.command.query';
import { Country } from '../domain/country.entity';
import { CreateCountryRequest } from './request/create-country.request';
import { UpdateCountryRequest } from './request/update-country.request';
import { CountryResponse } from './response/country.response';
import { OrderByDirection } from 'objection';
import { CountryMapper } from './mapper/coutry.mapper';

@ApiTags('Countries')
@Controller('public/countries')
export class CountryPublicController {
  constructor(
    private readonly findCountryByIdCommandQuery: FindCountryByIdCommandQuery,
    private readonly fetchCountriesCommandQuery: FetchCountriesCommandQuery
  ) {}


  @Get()
  @ApiOperation({ summary: 'Fetch all countries' })
  @ApiResponse({ status: 200, description: 'List of countries', type: [CountryResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: CountryResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchCountriesQuery(query, page, limit, sortBy, sortOrder);
    const result = await this.fetchCountriesCommandQuery.handler(fetchQuery);

    return {
      data: result.data.map((country) => CountryMapper.mapToResponse(country)),
      pagination: result.pagination,
    };
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CountryResponse> {
    const country = await this.findCountryByIdCommandQuery.handle(id);
    return CountryMapper.mapToResponse(country);
  }


}
