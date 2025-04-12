import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { Unit } from '../../domain/unit.entity';
import { CreateUnitCommand } from '../command/create-unit.command';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { Media } from 'src/modules/media/domain/media.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { IUnitTypeRepository } from '../../../unit_type/domain/unit-type.repository.interface';

@Injectable()
export class CreateUnitCommandHandler {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly unitTypeRepository: IUnitTypeRepository,
    ) {}

  @LogMethod()
  async handle(command: CreateUnitCommand): Promise<Unit> {
    const residence = await this.residenceRepository.findById(command.residenceId);
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    const unitType = await this.unitTypeRepository.findById(command.unitTypeId);
    if (!unitType) {
      throw new NotFoundException('Unit type not found');
    }

    const featureImage = await this.mediaRepository.findById(command.featureImageId);
    if (!featureImage) {
      throw new NotFoundException('Feature image not found');
    }

    const galleryMedia = await this.mediaRepository.findByIds(command.galleryMediaIds);

    if (galleryMedia.length !== command.galleryMediaIds.length) {
      const foundIds = galleryMedia.map((media) => media.id);
      const missingIds = command.galleryMediaIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Gallery image(s) not found for id(s): ${missingIds.join(', ')}`);
    }

    const unitData: Partial<Unit> = {
      name: command.name,
      description: command.description,
      surface: command.surface,
      status: command.status,
      regularPrice: command.regularPrice,
      exclusivePrice: command.exclusivePrice,
      exclusiveOfferStartDate: command.exclusiveOfferStartDate,
      exclusiveOfferEndDate: command.exclusiveOfferEndDate,
      roomType: command.roomType,
      roomAmount: command.roomAmount,
      unitType: unitType,
      serviceType: command.serviceType,
      serviceAmount: command.serviceAmount,
      featureImage: featureImage,
      residence: residence,
      gallery: galleryMedia,
      about: command.about,
      bathrooms: command.bathrooms,
      bedroom: command.bedroom,
      floor: command.floor,
      transactionType: command.transactionType,
      characteristics: command.characteristics,
    };

    const createdUnit = await this.unitRepository.create(unitData);

    if (!createdUnit) {
      throw new InternalServerErrorException('Unit could not be saved');
    }

    return createdUnit;
  }
}
