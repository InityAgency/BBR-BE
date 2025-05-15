import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class updateRankingCriteriaRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
