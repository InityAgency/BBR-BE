import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { ResidenceResponse } from '../response/residence.response';  // Import the ResidenceResponse
import { Unit } from '../../domain/unit.entity';
import { UnitResponse } from '../response/unit.response';
import { CreateUnitRequest } from '../request/create-unit.request';
import { CreateUnitCommand } from '../../application/command/create-unit.command';
import { UpdateUnitRequest } from '../request/update-unit.request';
import { UpdateUnitCommand } from '../../application/command/update-unit.command';

export class UnitMapper {
  static toCreateCommand(request: CreateUnitRequest): CreateUnitCommand {
    return new CreateUnitCommand(
      request.name,
      request.description,
      request.surface,
      request.status,
      request.regularPrice,
      request.exclusivePrice,
      request.exclusiveOfferStartDate,
      request.exclusiveOfferEndDate,
      request.roomType,
      request.roomAmount,
      request.unitType,
      request.serviceType,
      request.serviceAmount,
      request.featureImageId,
      request.residenceId,
      request.galleryMediaIds
    );
  }

  static toUpdateCommand(id: string, request: UpdateUnitRequest): UpdateUnitCommand {
    return new UpdateUnitCommand(
      id,
      request.name,
      request.description,
      request.surface,
      request.status,
      request.regularPrice,
      request.exclusivePrice,
      request.exclusiveOfferStartDate,
      request.exclusiveOfferEndDate,
      request.roomType,
      request.roomAmount,
      request.unitType,
      request.serviceType,
      request.serviceAmount,
      request.featureImageId,
      request.residenceId,
      request.galleryMediaIds,
    );
  }

  static toResponse(unit: Unit): UnitResponse {
console.log(unit);

    return new UnitResponse(
      unit.id,
      unit.name,
      unit.description,
      unit.surface,
      unit.status,
      unit.regularPrice,
      unit.exclusivePrice,
      unit.exclusiveOfferStartDate,
      unit.exclusiveOfferEndDate,
      unit.roomType,
      unit.roomAmount,
      unit.type,
      unit.serviceType,
      unit.serviceAmount,
      unit.gallery
        ? unit.gallery.map(
          (media) =>
            new MediaResponse(
              media.id,
              media.originalFileName,
              media.mimeType,
              media.uploadStatus,
              media.size,
              media.securedUrl
            )
        )
        : [],
      unit.featureImage
        ? new MediaResponse(
          unit.featureImage.id,
          unit.featureImage.originalFileName,
          unit.featureImage.mimeType,
          unit.featureImage.uploadStatus,
          unit.featureImage.size,
          unit.featureImage.securedUrl
        )
        : null,
        unit.residence
        ?
      new ResidenceResponse(
        unit.residence.id,
        unit.residence.name,
        unit.residence.status,
        unit.residence.developmentStatus,
        unit.residence.subtitle,
        unit.residence.description,
        unit.residence.budgetStartRange,
        unit.residence.budgetEndRange,
        unit.residence.address,
        unit.residence.longitude,
        unit.residence.latitude
      ) : null,
      unit.createdAt,
      unit.updatedAt
    );
  }
}
