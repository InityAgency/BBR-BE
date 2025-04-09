import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';

export class FetchUnitsQuery extends BaseFetchQuery {
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
  ) {
    super(query, page, limit, sortBy, sortOrder);
  }
}
