import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchBrandsQuery extends BaseFetchQuery {
  constructor(page?: number, limit?: number, sortBy?: string, sortOrder?) {
    super(page, limit, sortBy, sortOrder);
  }
}
