import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAmenityCommand } from '../commands/update-amenity.command';
import { Amenity } from '../../domain/amenity.entity';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { IMediaRepository } from '../../../../media/domain/media.repository.interface';
import { IAmenityRepository } from '../../domain/amenity.repository.interface';

@Injectable()
export class UpdateAmenityCommandHandler {
  constructor(
    private readonly amenityRepository: IAmenityRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateAmenityCommand): Promise<Amenity> {
    const existingAmenity = await this.amenityRepository.findById(command.id);
    if (!existingAmenity) {
      throw new NotFoundException('Amenity not found');
    }

    const existingAmenityByName = await this.amenityRepository.findByName(command.name);
    if (existingAmenityByName && existingAmenityByName.id !== command.id) {
      throw new ConflictException('Amenity with this name already exists');
    }

    const icon = await this.mediaRepository.findById(command.iconId);
    if (!icon) {
      throw new NotFoundException('Icon not found');
    }

    const updatedAmenity = await this.amenityRepository.update(command.id, {
      name: command.name,
      description: command.description,
      icon: icon,
    });

    if (!updatedAmenity) {
      throw new InternalServerErrorException('Amenity not updated');
    }

    return updatedAmenity;
  }
}
