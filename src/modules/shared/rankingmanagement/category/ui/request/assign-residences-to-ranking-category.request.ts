import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AssignResidencesToRankingCategoryRequest {
  @IsUUID()
  rankingCategoryId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  residenceIds: string[];
}
