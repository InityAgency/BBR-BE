import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { BrandStatus } from '../../domain/brand-status.enum';

export class CreateBrandRequest {
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

  @IsUUID()
  @IsNotEmpty()
  logoId: string;

  @IsEnum(BrandStatus)
  status: BrandStatus;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  registeredAt: Date;
}
