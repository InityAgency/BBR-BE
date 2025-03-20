import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { BrandStatus } from '../../domain/brand-status.enum';

export class UpdateBrandRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsString()
  @MaxLength(1024)
  description: string;

  @IsUUID()
  @IsNotEmpty()
  brandTypeId: string;

  @IsOptional()
  logoId: string;

  @IsEnum(BrandStatus)
  status: BrandStatus;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  registeredAt: Date;
}
