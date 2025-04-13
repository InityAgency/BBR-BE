import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingCriteriaResponse } from './response/ranking-criteria.response';

@ApiTags('Ranking Criteria')
@Controller('ranking-criteria')
export class RankingCriteriaController {
  constructor() // private readonly findAllRankingCriteriaResidenceCategoryCommandQuery: FindAllRankingCriteriaResidenceCategoryCommandQuery
  {}

  // @Get('/residences/:residenceId/categories/:categoryId')
  // @ApiOperation({ summary: 'Get criteria for residence by category' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'List of criteria for a residence and category',
  //   type: [RankingCriteriaResponse],
  // })
  // async getForResidenceAndCategory(
  //   @Param('residenceId') residenceId: string,
  //   @Param('categoryId') categoryId: string
  // ): Promise<RankingCriteriaResponse[]> {
  //   const criteria = await this.findAllRankingCriteriaResidenceCategoryCommandQuery.handle(residenceId, categoryId);
  //   return cirteria;
  // }
}
