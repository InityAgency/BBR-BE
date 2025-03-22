import { IsDate, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BrandType } from '../../domain/brand-type.enum';
import { BrandStatus } from '../../domain/brand-status.enum';
import { Type } from 'class-transformer';

export class UpdateBrandStatusRequest {
  @IsNotEmpty()
  @IsEnum(BrandStatus)
  status: BrandStatus;
}