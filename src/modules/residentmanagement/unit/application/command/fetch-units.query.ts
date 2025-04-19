import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';
import { UnitStatusEnum } from '../../domain/unit-status.enum';

export class FetchUnitsQuery extends BaseFetchQuery {
  unitTypeId?: string[];
  status?: UnitStatusEnum[];
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    unitTypeId?: string[],
    status?: UnitStatusEnum[]
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.unitTypeId = unitTypeId;
    this.status = status;
  }
}
