import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateResidenceRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  websiteUrl: string;

  @IsNotEmpty()
  @IsString()
  budgetStartRange: string;

  @IsNotEmpty()
  @IsString()
  budgetEndRange: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @IsNotEmpty()
  @IsUUID()
  countryId: string;

  @IsNotEmpty()
  @IsUUID()
  cityId: string;
}
