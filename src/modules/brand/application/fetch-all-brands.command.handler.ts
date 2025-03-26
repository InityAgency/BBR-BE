import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { Brand } from '../domain/brand.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchBrandsQuery } from './command/fetch-brands.query';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { BrandResponse } from '../ui/response/brand-response';

@Injectable()
export class FetchAllBrandCommandHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(
    query: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const result = await this.brandRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
