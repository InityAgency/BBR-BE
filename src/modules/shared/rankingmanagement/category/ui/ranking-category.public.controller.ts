import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { FetchResidencesByCategoryCommandQuery } from '../application/query/fetch-residences-by-category.query';
import { RankingCategoryResponse } from './response/ranking-category.response';

@Controller('public/ranking-categories')
export class RankingCategoryPublicController {
  constructor(
    private readonly fetchResidencesByCategoryCommandQuery: FetchResidencesByCategoryCommandQuery
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
    @Query('sortOrder') sortOrder?: OrderByDirection
  ) {
    const { data, pagination } = await this.fetchResidencesByCategoryCommandQuery.handle(
      slug,
      new FetchRankingCategoriesQuery(query, page, limit, sortBy, sortOrder)
    );

    // const mappedRankingCategories = data.map((category: RankingCategory) =>
    //   RankingCategoryMapper.toResponse(category)
    // );

    return {
      data: data,
      pagination,
    };
  }
}
