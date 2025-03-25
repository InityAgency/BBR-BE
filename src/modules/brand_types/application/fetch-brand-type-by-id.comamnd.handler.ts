import { Injectable, NotFoundException } from '@nestjs/common';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { FetchBrandTypeByIdCommand } from './command/fetch-brand-type-by-id.command';
import { BrandTypeResponseWithBrands } from '../ui/response/brand-type-with-brands.response';

@Injectable()
export class FetchBrandTypeByIdCommandHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  async handle(command: FetchBrandTypeByIdCommand): Promise<BrandTypeResponseWithBrands> {
    const brandType = await this.brandTypesRepository.findById(command.id);

    if (!brandType) {
      throw new NotFoundException('Brand type not found');
    }

    if (brandType.deletedAt) {
      throw new NotFoundException('Brand type deleted');
    }

    return brandType;
  }
}
