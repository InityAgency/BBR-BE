import { BrandResponse } from 'src/modules/brand/ui/response/brand-response';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { CityResponse } from './city.response';
import { CountryResponse } from './country.response';

export class ResidencePublicResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: ResidenceStatusEnum,
    public readonly developmentStatus: DevelopmentStatusEnum,
    public readonly address: string,
    public readonly country: CountryResponse | null,
    public readonly city: CityResponse | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly brand?: BrandResponse | null,
  ) {}
}
