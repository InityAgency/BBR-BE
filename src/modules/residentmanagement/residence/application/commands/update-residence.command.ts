import { DevelompentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';

export class UpdateResidenceCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly websiteUrl?: string,
    public readonly subtitle?: string,
    public readonly description?: string,
    public readonly budgetStartRange?: string,
    public readonly budgetEndRange?: string,
    public readonly address?: string,
    public readonly latitude?: string,
    public readonly longitude?: string,
    public readonly brandId?: string,
    public readonly countryId?: string,
    public readonly cityId?: string,
    public readonly rentalPotential?: RentalPotentialEnum,
    public readonly developmentStatus?: DevelompentStatusEnum,
    public readonly yearBuilt?: string,
    public readonly floorSqft?: string,
    public readonly staffRatio?: number,
    public readonly avgPricePerUnit?: string,
    public readonly avgPricePerSqft?: string,
    public readonly petFriendly?: boolean,
    public readonly disabledFriendly?: boolean,
    public readonly videoTourUrl?: string,
    public readonly videoTourId?: string,
    public readonly featuredImageId?: string,
    public readonly keyFeatures?: string[],
    public readonly amenities?: string[],
    public readonly companyId?: string,
    public readonly mainGallery?: { id: string; order: number }[],
    public readonly secondaryGallery?: { id: string; order: number }[]
  ) {}
}
