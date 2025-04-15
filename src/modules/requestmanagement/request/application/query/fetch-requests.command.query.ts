import { Injectable } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { FetchRequestsQuery } from '../command/fetch-requests.query';
import { Request } from '../../domain/request.entity';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';

@Injectable()
export class FetchRequestsCommandQuery {
  constructor(
    private readonly requestRepository: IRequestRepository
  ) {}

  async handle(query: FetchRequestsQuery): Promise<{ data: Request[]; pagination: PaginationResponse }> {
    const result = await this.requestRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
