import { IsBoolean, IsEnum, IsNumber, IsOptional, isUUID, IsUUID } from 'class-validator';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { DevelompentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';
import { Type } from 'class-transformer';

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
  @IsNumber()
  @Type(() => Number)
  budgetStartRange: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  budgetEndRange: number;

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
  @IsNumber()
  @Type(() => Number)
  floorSqft: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  staffRatio: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  avgPricePerUnit: number;

  @IsOptional()
  @Type(() => Number)
  avgPricePerSqft: number;

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

  @IsOptional()
  mainGallery: { id: string; order: number }[];

  @IsOptional()
  secondaryGallery: { id: string; order: number }[];
}
