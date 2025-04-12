import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';

export class FetchUnitsQuery extends BaseFetchQuery {
  unitTypeId?: string[];
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    unitTypeId?: string[]
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.unitTypeId=unitTypeId;
  }
}
