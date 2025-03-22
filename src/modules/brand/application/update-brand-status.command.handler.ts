import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { UpdateBrandStatusCommand } from './command/update-brand-status.command';
import { BrandStatus } from '../domain/brand-status.enum';

@Injectable()
export class UpdateBrandStatusCommandHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(command: UpdateBrandStatusCommand): Promise<void> {
    const existingBrand = await this.brandRepository.findById(command.id);
    if (!existingBrand) {
      throw new NotFoundException('Brand not found');
    }

    const updated = await this.brandRepository.update(command.id, { status: command.status as BrandStatus });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update brand status');
    }
  }
}
