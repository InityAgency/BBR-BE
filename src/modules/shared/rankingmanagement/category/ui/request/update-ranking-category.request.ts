import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class UpdateRankingCategoryRequest {
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;

  @IsUUID()
  rankingCategoryTypeId: string;

  @IsString()
  @MaxLength(512)
  residenceLimitation: string;

  @IsNumber()
  @Type(() => Number)
  rankingPrice: number;

  @IsUUID()
  featuredImageId: string;

  @IsEnum(RankingCategoryStatus)
  status: RankingCategoryStatus;
}
