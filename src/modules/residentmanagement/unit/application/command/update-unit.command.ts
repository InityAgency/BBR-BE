import { UnitStatusEnum } from '../../domain/unit-status.enum';

export class UpdateUnitCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly surface: number,
    public readonly status: UnitStatusEnum,
    public readonly regularPrice: number,
    public readonly exclusivePrice: number,
    public readonly exclusiveOfferStartDate: Date,
    public readonly exclusiveOfferEndDate: Date,
    public readonly roomType: string,
    public readonly roomAmount: number,
    public readonly type: string,
    public readonly serviceType: string,
    public readonly serviceAmount: number,
    public readonly featureImageId: string,
    public readonly residenceId: string,
    public readonly galleryMediaIds: string[],
  ) {}
}
