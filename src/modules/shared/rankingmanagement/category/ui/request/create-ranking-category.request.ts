import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class CreateRankingCategoryRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;

  @IsUUID()
  @IsNotEmpty()
  rankingCategoryTypeId: string;

  @IsString()
  @MaxLength(512)
  residenceLimitation: string;

  @IsNumber()
  @Type(() => Number)
  rankingPrice: number;

  @IsUUID()
  @IsNotEmpty()
  featuredImageId: string;

  @IsNotEmpty()
  @IsEnum(RankingCategoryStatus)
  status: RankingCategoryStatus;
}
