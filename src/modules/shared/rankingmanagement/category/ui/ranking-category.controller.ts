import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { CreateRankingCategoryCommandHandler } from '../application/handler/create-ranking-category.command.handler';
import { DeleteRankingCategoryCommandHandler } from '../application/handler/delete-ranking-category.command.handler';
import { UpdateRankingCategoryStatusCommandHandler } from '../application/handler/update-ranking-category-status.command.handler';
import { UpdateRankingCategoryCommandHandler } from '../application/handler/update-ranking-category.command.handler';
import { FetchRankingCategoriesCommandQuery } from '../application/query/fetch-ranking-categories.query';
import { FindRankingCategoryByIdCommandQuery } from '../application/query/find-by-id-ranking-category.query';
import { RankingCategoryStatus } from '../domain/ranking-category-status.enum';
import { RankingCategory } from '../domain/ranking-category.entity';
import { RankingCategoryMapper } from './mapper/ranking-category.mapper';
import { CreateRankingCategoryRequest } from './request/create-ranking-category.request';
import { UpdateRankingCategoryStatusRequest } from './request/update-ranking-category-status.request';
import { UpdateRankingCategoryRequest } from './request/update-ranking-category.request';
import { RankingCategoryResponse } from './response/ranking-category.response';

@ApiTags('Ranking Categories')
@Controller('ranking-categories')
export class RankingCategoryController {
  constructor(
    private readonly fetchRankingCategoriesCommandQuery: FetchRankingCategoriesCommandQuery,
    private readonly findRankingCategoryByIdCommandQuery: FindRankingCategoryByIdCommandQuery,
    private readonly createRankingCategoryCommandHandler: CreateRankingCategoryCommandHandler,
    private readonly updateRankingCategoryCommandHandler: UpdateRankingCategoryCommandHandler,
    private readonly updateRankingCategoryStatusCommandHandler: UpdateRankingCategoryStatusCommandHandler,
    private readonly deleteRankingCategoryCommandHandler: DeleteRankingCategoryCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all ranking categories' })
  @ApiResponse({ type: [RankingCategoryResponse] })
  async fetchAll(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get ranking category by ID' })
  @ApiResponse({ type: RankingCategoryResponse })
  async findById(@Param('id') id: string) {
    const rankingCategory = await this.findRankingCategoryByIdCommandQuery.handle(id);

    return RankingCategoryMapper.toResponse(rankingCategory);
  }

  @Post()
  @ApiOperation({ summary: 'Create a ranking category' })
  @ApiResponse({ type: RankingCategoryResponse })
  async create(@Body() createRankingCategoryRequest: CreateRankingCategoryRequest) {
    const command = RankingCategoryMapper.toCreateCommand(createRankingCategoryRequest);
    const createdRankingCategory = await this.createRankingCategoryCommandHandler.handle(command);

    return RankingCategoryMapper.toResponse(createdRankingCategory);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ranking category' })
  @ApiResponse({ type: RankingCategoryResponse })
  async update(
    @Param('id') id: string,
    @Body() updateRankingCategoryRequest: UpdateRankingCategoryRequest
  ) {
    const command = RankingCategoryMapper.toUpdateCommand(id, updateRankingCategoryRequest);
    const updatedRankingCategory = await this.updateRankingCategoryCommandHandler.handle(command);

    return RankingCategoryMapper.toResponse(updatedRankingCategory);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update ranking category status' })
  @ApiResponse({ type: RankingCategoryResponse })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateRankingCategoryStatusRequest: UpdateRankingCategoryStatusRequest
  ): Promise<void> {
    const command = RankingCategoryMapper.toUpdateStatusCommand(
      id,
      updateRankingCategoryStatusRequest
    );
    await this.updateRankingCategoryStatusCommandHandler.handle(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a ranking category' })
  async delete(@Param('id') id: string) {
    return this.deleteRankingCategoryCommandHandler.handle(id);
  }
}
