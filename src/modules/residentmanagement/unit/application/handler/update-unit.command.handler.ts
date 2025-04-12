import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { UpdateUnitCommand } from '../command/update-unit.command';
import { Unit } from '../../domain/unit.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { IUnitTypeRepository } from '../../../unit_type/domain/unit-type.repository.interface';

@Injectable()
export class UpdateUnitCommandHandler {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly unitTypeRepository: IUnitTypeRepository,
  ) {}

  @LogMethod()
  async handle(command: UpdateUnitCommand): Promise<Unit> {
    const existingUnit = await this.unitRepository.findById(command.id);
    if (!existingUnit) {
      throw new NotFoundException('Unit not found');
    }

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

    const updateData: Partial<Unit> = {
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

    const updatedUnit = await this.unitRepository.update(existingUnit.id, updateData);
    if (!updatedUnit) {
      throw new InternalServerErrorException('Unit could not be updated');
    }

    return updatedUnit;
  }
}
