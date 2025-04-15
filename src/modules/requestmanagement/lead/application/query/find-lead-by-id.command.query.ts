import { Injectable, NotFoundException } from '@nestjs/common';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { Lead } from '../../domain/lead.entity';

@Injectable()
export class FindLeadByIdCommandQuery {
  constructor(
    private readonly leadRepository: ILeadRepository
  ) {}

  async handle(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }
}
