import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { CreateBrandCommand } from './command/create-brand.command';
import { Brand } from '../domain/brand.entity';
import { BrandType } from '../domain/brand-type.enum';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { BrandStatus } from '../domain/brand-status.enum';

@Injectable()
export class CreateBrandCommandHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(command: CreateBrandCommand): Promise<Brand> {
    const existingBrand = await this.brandRepository.findByName(command.name);
    if (existingBrand) {
      throw new ConflictException('Brand already exists');
    }

    const brand = await Brand.create({
      name: command.name,
      description: command.description,
      type: command.type as BrandType,
      status: command.status as BrandStatus,
      registeredAt: command.registeredAt,
    });

    const created = await this.brandRepository.findById(brand.id);
    if (!created) {
      throw new InternalServerErrorException('Brand not saved');
    }

    return created;
  }
}
