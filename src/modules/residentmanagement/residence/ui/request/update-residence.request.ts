import { IsBoolean, IsEnum, IsOptional, isUUID, IsUUID } from 'class-validator';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { DevelompentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';

export class UpdateResidenceRequest {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(ResidenceStatusEnum)
  status: ResidenceStatusEnum;

  @IsOptional()
  @IsEnum(DevelompentStatusEnum)
  developmentStatus: DevelompentStatusEnum;

  @IsOptional()
  websiteUrl: string;

  @IsOptional()
  subtitle: string;

  @IsOptional()
  description: string;

  @IsOptional()
  budgetStartRange: string;

  @IsOptional()
  budgetEndRange: string;

  @IsOptional()
  address: string;

  @IsOptional()
  latitude: string;

  @IsOptional()
  longitude: string;

  @IsOptional()
  brandId: string;

  @IsOptional()
  countryId: string;

  @IsOptional()
  cityId: string;

  @IsOptional()
  @IsEnum(RentalPotentialEnum)
  rentalPotential: RentalPotentialEnum;

  @IsOptional()
  yearBuilt: string;

  @IsOptional()
  floorSqft: string;

  @IsOptional()
  staffRatio: number;

  @IsOptional()
  avgPricePerUnit: string;

  @IsOptional()
  avgPricePerSqft: string;

  @IsOptional()
  @IsBoolean()
  petFriendly: boolean;

  @IsOptional()
  @IsBoolean()
  disabledFriendly: boolean;

  @IsOptional()
  videoTourUrl: string;

  @IsOptional()
  @IsUUID()
  videoTourId: string;

  @IsOptional()
  @IsUUID()
  featuredImageId: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  keyFeatures: string[];

  @IsOptional()
  @IsUUID('all', { each: true })
  amenities: string[];

  @IsOptional()
  @IsUUID()
  companyId: string;
}
