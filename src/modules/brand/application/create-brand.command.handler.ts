import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { BrandStatus } from '../domain/brand-status.enum';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { CreateBrandCommand } from './command/create-brand.command';

@Injectable()
export class CreateBrandCommandHandler {
  constructor(
    private readonly brandRepository: IBrandRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: CreateBrandCommand): Promise<Brand> {
    const existingBrand = await this.brandRepository.findByName(command.name);
    if (existingBrand) {
      throw new ConflictException('Brand already exists');
    }

    const newLogo = command.uploads?.find((m) => m.mediaType === 'logo');

    const brand = await Brand.create({
      name: command.name,
      description: command.description,
      brandTypeId: command.brandTypeId,
      logoId: newLogo?.id,
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
