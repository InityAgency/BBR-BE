import { Injectable } from '@nestjs/common';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { FetchLeadsQuery } from '../command/fetch-leads.query';
import { Lead } from '../../domain/lead.entity';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';

@Injectable()
export class FetchLeadsCommandQuery {
  constructor(
    private readonly leadRepository: ILeadRepository
  ) {}

  async handle(query: FetchLeadsQuery): Promise<{ data: Lead[]; pagination: PaginationResponse }> {
    const result = await this.leadRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
