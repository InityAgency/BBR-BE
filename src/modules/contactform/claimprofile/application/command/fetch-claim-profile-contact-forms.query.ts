import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';

export class FetchClaimProfileContactFormsQuery extends BaseFetchQuery {
  status?: ClaimProfileContactFormStatus;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    status?: ClaimProfileContactFormStatus,
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.status = status;
  }
}
