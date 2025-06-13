import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';

export class FetchLeadsQuery extends BaseFetchQuery {
  email?: string[];
  firstName?: string[];
  lastName?: string[];
  status?: string[];
  companyId?: string;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    email?: string[],
    firstName?: string[],
    lastName?: string[],
    status?: string[],
    companyId?: string
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = status;
    this.companyId = companyId;
  }
}
