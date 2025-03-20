import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchAllBrandTypesQueryHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  @LogMethod()
  async handle() {
    const brandTypes = await this.brandTypesRepository.findAll();

    return brandTypes;
  }
}
