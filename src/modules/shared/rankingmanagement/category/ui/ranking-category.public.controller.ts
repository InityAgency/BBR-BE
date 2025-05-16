import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { RankingCategoryStatus } from '../domain/ranking-category-status.enum';
import { RankingCategory } from '../domain/ranking-category.entity';
import { RankingCategoryMapper } from './mapper/ranking-category.mapper';
import { RankingCategoryResponse } from './response/ranking-category.response';
import { FetchRankingCategoriesCommandQuery } from '../application/query/fetch-ranking-categories.query';

@Controller('public/ranking-categories')
export class RankingCategoryPublicController {
  constructor(
    private readonly fetchRankingCategoriesCommandQuery: FetchRankingCategoriesCommandQuery
  ) {}

  @Get(':slug/residences')
  @ApiOperation({ summary: 'Get all ranking categories' })
  @ApiResponse({ type: [RankingCategoryResponse] })
  async fetchResidencesByCategory(
    @Param('slug') slug: string,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('status') status?: RankingCategoryStatus[],
    @Query('categoryTypeId') categoryTypeId?: string[]
  ) {
    const { data, pagination } = await this.fetchRankingCategoriesCommandQuery.handle(
      new FetchRankingCategoriesQuery(query, page, limit, sortBy, sortOrder, status, categoryTypeId)
    );

    const mappedRankingCategories = data.map((category: RankingCategory) =>
      RankingCategoryMapper.toResponse(category)
    );

    return {
      data: mappedRankingCategories,
      pagination,
    };
  }
}
