import { IsString, IsEnum, IsOptional, IsNotEmpty, MaxLength, IsDate } from 'class-validator';
import { BrandType } from '../../domain/brand-type.enum';
import { BrandStatus } from '../../domain/brand-status.enum';
import { Type } from 'class-transformer';

export class UpdateBrandRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsString()
  @MaxLength(1024)
  description: string;

  @IsEnum(BrandType)
  type: BrandType;

  @IsEnum(BrandStatus)
  status: BrandStatus;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  registeredAt: Date;
}
