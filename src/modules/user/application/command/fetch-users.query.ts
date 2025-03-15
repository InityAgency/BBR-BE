import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchUsersQuery extends BaseFetchQuery {
  constructor(page?: number, limit?: number) {
    super(page, limit);
  }
}
