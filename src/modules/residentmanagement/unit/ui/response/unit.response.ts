import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { ResidenceResponse } from './residence.response';

export class UnitResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly surface: number,
    public readonly status: string,
    public readonly regularPrice: number,
    public readonly exclusivePrice: number,
    public readonly exclusiveOfferStartDate: Date,
    public readonly exclusiveOfferEndDate: Date,
    public readonly roomType: string,
    public readonly roomAmount: number,
    public readonly unitType: string,
    public readonly serviceType: string,
    public readonly serviceAmount: number,
    public readonly gallery: MediaResponse[],
    public readonly featureImage: MediaResponse | null,
    public readonly residence: ResidenceResponse | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
