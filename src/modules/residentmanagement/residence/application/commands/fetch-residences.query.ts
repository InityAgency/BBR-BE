import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';

export class FetchResidencesQuery extends BaseFetchQuery {
  status?: ResidenceStatusEnum[];
  cityId?: string[];
  brandId?: string[];
  address?: string[];
  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: ResidenceStatusEnum[],
    cityId?: string[],
    brandId?: string[],
    address?: string[]
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);
    this.status = status;
    this.cityId = cityId;
    this.brandId = brandId;
    this.address = address;
  }
}
