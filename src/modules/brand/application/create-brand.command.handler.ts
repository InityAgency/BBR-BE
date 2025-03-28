import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { BrandStatus } from '../domain/brand-status.enum';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { CreateBrandCommand } from './command/create-brand.command';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { IBrandTypesRepository } from 'src/modules/brand_types/domain/brand-type.repository.interface';

@Injectable()
export class CreateBrandCommandHandler {
  constructor(
    private readonly brandRepository: IBrandRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly brandTypeRepository: IBrandTypesRepository,
    private readonly mediaService: IMediaService
  ) {}

  @LogMethod()
  async handle(command: CreateBrandCommand): Promise<Brand> {
    const existingBrand = await this.brandRepository.findByName(command.name);
    if (existingBrand) {
      throw new ConflictException('Brand already exists');
    }

    const logo = await this.mediaRepository.findById(command.logoId);
    if (!logo) {
      throw new NotFoundException('Logo not found');
    }

    const brandType = await this.brandTypeRepository.findById(command.brandTypeId);
    if (!brandType) {
      throw new NotFoundException('Brand type not found');
    }

    const brandData = {
      name: command.name,
      description: command.description,
      brandTypeId: command.brandTypeId,
      status: command.status as BrandStatus,
      registeredAt: command.registeredAt,
      logoId: logo.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.brandRepository.create(brandData);

    if (!created) {
      throw new InternalServerErrorException('Brand not saved');
    }

    await this.mediaService.addTemporalUrl(created.logo);

    return created;
  }
}
