import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchBrandsQuery extends BaseFetchQuery {
  constructor( searchQuery?: string, page?: number, limit?: number, sortBy?: string, sortOrder?) {
    super( searchQuery,page, limit, sortBy, sortOrder);
  }
}
