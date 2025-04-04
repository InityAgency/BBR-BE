import { BrandResponse } from 'src/modules/brand/ui/response/brand-response';
import { CompanyResponse } from 'src/modules/company/ui/response/company.response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { AmenityResponse } from 'src/modules/residentmanagement/amenity/ui/response/amenity.response';
import { KeyFeatureResponse } from 'src/modules/residentmanagement/key_feature/ui/response/key-feature.response';
import { CityResponse } from 'src/modules/shared/city/ui/response/city.response';
import { CountryResponse } from 'src/modules/shared/country/ui/response/country.response';
import { DevelompentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';

export class ResidenceResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: ResidenceStatusEnum,
    public readonly developmentStatus: DevelompentStatusEnum,
    public readonly subtitle: string,
    public readonly description: string,
    public readonly budgetStartRange: string,
    public readonly budgetEndRange: string,
    public readonly address: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly country: CountryResponse,
    public readonly city: CityResponse,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly rentalPotential?: RentalPotentialEnum,
    public readonly websiteUrl?: string,
    public readonly yearBuild?: string,
    public readonly floorSqft?: string,
    public readonly staffRatio?: number,
    public readonly avgPricePerUnit?: string,
    public readonly avgPricePerSqft?: string,
    public readonly petFriendly?: boolean,
    public readonly disabledFriendly?: boolean,
    public readonly videoTourUrl?: string,
    public readonly videoTour?: MediaResponse | null,
    public readonly featuredImage?: MediaResponse | null,
    public readonly keyFeatures?: KeyFeatureResponse[] | null,
    public readonly brand?: BrandResponse | null,
    public readonly amenities?: AmenityResponse[] | null,
    public readonly company?: CompanyResponse | null
  ) {}
}
