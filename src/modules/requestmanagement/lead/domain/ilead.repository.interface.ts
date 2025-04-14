import { Lead } from './lead.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchLeadsQuery } from '../application/command/fetch-leads.query';

export abstract class ILeadRepository {
  abstract create(data: Partial<Lead>): Promise<Lead | undefined>;

  abstract findById(id: string): Promise<Lead | undefined>;

  abstract findByEmail(email: string): Promise<Lead | undefined>;

  abstract findAll(
    query: FetchLeadsQuery
  ): Promise<{ data: Lead[]; pagination: PaginationResponse }>;

  abstract update(id: string, data: Partial<Lead>): Promise<Lead | undefined>;

  abstract softDelete(id: string): Promise<void>;
}
