import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { UpdateBrandCommand } from './command/update-brand.command';
import { BrandType } from '../domain/brand-type.enum';
import { BrandStatus } from '../domain/brand-status.enum';

@Injectable()
export class UpdateBrandCommandHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(command: UpdateBrandCommand): Promise<Brand> {
    const existingBrand = await this.brandRepository.findById(command.id);
    if (!existingBrand) {
      throw new NotFoundException('Brand not found');
    }

    const existingBrandByName = await this.brandRepository.findByName(command.name);
    if (existingBrandByName && existingBrandByName.id !== command.id) {
      throw new ConflictException('Brand with this name already exists');
    }

    const updateData: Partial<Brand> = {
      name: command.name,
      description: command.description,
      brandTypeId: command.brandTypeId,
      logoId: command.logoId,
      status: command.status as BrandStatus,
      registeredAt: command.registeredAt,
    };

    const updatedBrand = await this.brandRepository.update(existingBrand.id, updateData);
    if (!updatedBrand) {
      throw new InternalServerErrorException('Brand not updated');
    }

    return updatedBrand;
  }
}
