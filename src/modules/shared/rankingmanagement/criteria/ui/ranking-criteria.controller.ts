import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingCriteriaResponse } from './response/ranking-criteria.response';
import { FindAllRankingCriteriaForResidenceQueryHandler } from '../application/query/find-all-ranking-criteria-residence-category.query.handler';
import { FetchAllRankingCriteriaForResidenceQuery } from '../application/commands/fetch-ranking-criteria-for-residence.query';
import { RankingCriteriaMapper } from './mappers/ranking-criteria.mapper';
import { FindAllRankingCriteriaQueryHandler } from '../application/query/find-all-ranking-criteria.query.handler';
import { OrderByDirection } from 'objection';
import { FetchRankingCriteriaQuery } from '../application/commands/fetch-ranking-criteria.query';
import { RankingCriteria } from '../domain/ranking-criteria.entity';

@ApiTags('Ranking Criteria')
@Controller('ranking-criteria')
export class RankingCriteriaController {
  constructor(
    private readonly findAllRankingCriteriaForResidenceCommandQuery: FindAllRankingCriteriaForResidenceQueryHandler,
    private readonly FindAllRankingCriteriaQueryHandler: FindAllRankingCriteriaQueryHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all criteria' })
  @ApiResponse({
    status: 200,
    description: 'List of criteria',
    type: [RankingCriteriaResponse],
  })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ) {
    const { data, pagination } = await this.FindAllRankingCriteriaQueryHandler.handle(
      new FetchRankingCriteriaQuery(query, page, limit, sortBy, sortOrder)
    );

    const mappedCriteria = data.map((criteria: RankingCriteria) =>
      RankingCriteriaMapper.toResponse(criteria)
    );
    return {
      data: mappedCriteria,
      pagination,
    };
  }

  @Get('/residences/:residenceId/categories/:categoryId')
  @ApiOperation({ summary: 'Get criteria for residence by category' })
  @ApiResponse({
    status: 200,
    description: 'List of criteria for a residence and category',
    type: [RankingCriteriaResponse],
  })
  async getForResidenceAndCategory(
    @Param('residenceId') residenceId: string,
    @Param('categoryId') categoryId: string
  ): Promise<RankingCriteriaResponse[]> {
    const query = new FetchAllRankingCriteriaForResidenceQuery(residenceId, categoryId);

    const data = await this.findAllRankingCriteriaForResidenceCommandQuery.handle(query);

    const mappedCriteria = data.map((criteria: RankingCriteria) =>
      RankingCriteriaMapper.toResponse(criteria)
    );

    return mappedCriteria;
  }
}
