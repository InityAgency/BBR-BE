import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { UnitStatusEnum } from '../../domain/unit-status.enum';

export class UpdateUnitRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

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
  @IsString()
  unitType: string;

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
}
