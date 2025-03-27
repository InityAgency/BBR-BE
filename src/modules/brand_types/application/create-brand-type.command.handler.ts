import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { CreateBrandTypesCommand } from './command/create-brand-type.command';
import { BrandType } from '../domain/brand-type.entity';

@Injectable()
export class CreateBrandTypesCommandHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  async handle(command: CreateBrandTypesCommand) {
    const existingBrandType = await this.brandTypesRepository.findByName(command.name);

    if (existingBrandType) {
      throw new ConflictException('Brand type already exists');
    }

    const brandType = await BrandType.create({
      name: command.name,
    });

    const created = await this.brandTypesRepository.findById(brandType.id);

    if (!created) {
      throw new InternalServerErrorException('Brand not saved');
    }

    return created;
  }
}
