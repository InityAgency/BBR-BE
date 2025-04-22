import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { UnitStatusEnum } from '../../domain/unit-status.enum';
import { UnitTransactionTypeEnum } from '../../domain/unit-transaction-type.enum';

export class UpdateUnitRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  slug: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  surface: number;

  @IsNotEmpty()
  @IsEnum(UnitStatusEnum)
  status: UnitStatusEnum;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  regularPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  exclusivePrice: number;

  @IsNotEmpty()
  @Type(() => Date)
  exclusiveOfferStartDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  exclusiveOfferEndDate: Date;

  @IsNotEmpty()
  @IsString()
  roomType: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  roomAmount: number;

  @IsNotEmpty()
  @IsUUID()
  unitTypeId: string;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  serviceAmount: number;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  galleryMediaIds: string[];

  @IsNotEmpty()
  @IsUUID()
  featureImageId: string;

  @IsNotEmpty()
  @IsUUID()
  residenceId: string;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsString()
  bathrooms: string;

  @IsNotEmpty()
  @IsString()
  bedroom: string;

  @IsNotEmpty()
  @IsString()
  floor: string;

  @IsNotEmpty()
  @IsEnum(UnitTransactionTypeEnum)
  transactionType: UnitTransactionTypeEnum = UnitTransactionTypeEnum.SALE;

  @IsArray()
  @IsString({ each: true })
  characteristics: string[];
}
