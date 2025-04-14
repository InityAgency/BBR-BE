import { Injectable, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { Request } from '../../domain/request.entity';

@Injectable()
export class FindRequestByIdCommandQuery {
  constructor(
    private readonly requestRepository: IRequestRepository
  ) {}

  async handle(id: string): Promise<Request> {
    const request = await this.requestRepository.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }
}
