import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  isUUID,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { BaseMediaRequest } from 'src/shared/ui/request/base-media.request';
import { BrandStatus } from '../../domain/brand-status.enum';

export class CreateBrandRequest extends BaseMediaRequest {
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
