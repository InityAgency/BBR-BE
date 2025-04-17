import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  Patch, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { FetchReviewsCommandQuery } from '../application/query/fetch-reviews-command.query';
import { FindReviewByIdCommandQuery } from '../application/query/find-review-by-id-command.query';
import { CreateReviewCommandHandler } from '../application/handler/create-review-command.handler';
import {
  UpdateReviewStatusCommandHandler
} from '../application/handler/update-review-status-command.handler';
import { DeleteReviewCommandHandler } from '../application/handler/delete-review-command.handler';
import { ReviewResponse } from './response/review.response';
import { FetchReviewsQuery } from '../application/command/fetch-reviews.query';
import { Review } from '../domain/review.entity';
import { ReviewMapper } from './mapper/review.mapper';
import { CreateReviewRequest } from './request/create-review.request';
import { UpdateReviewStatusRequest } from './request/update-review-status.request';
import { User } from 'src/modules/user/domain/user.entity';
import { log } from 'console';
import { OrderByDirection } from 'objection';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly fetchReviewsCommandQuery: FetchReviewsCommandQuery,
    private readonly findReviewByIdCommandQuery: FindReviewByIdCommandQuery,
    private readonly createReviewCommandHandler: CreateReviewCommandHandler,
    private readonly updateReviewStatusCommandHandler: UpdateReviewStatusCommandHandler,
    private readonly deleteReviewCommandHandler: DeleteReviewCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ type: [ReviewResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('residenceId') residenceId?: string[],
    @Query('userId') userId?: string[],
    @Query('status') status?: string[],
    @Query('unitTypeId') unitTypeId?: string[],
  ) {
    const { data, pagination } = await this.fetchReviewsCommandQuery.handle(
      new FetchReviewsQuery(query, page, limit, sortBy, sortOrder, status, residenceId, userId, unitTypeId)
    );

    const mapped = data.map((review: Review) => ReviewMapper.toResponse(review));

    return {
      data: mapped,
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ type: ReviewResponse })
  async findById(@Param('id') id: string) {
    const review = await this.findReviewByIdCommandQuery.handle(id);

    return ReviewMapper.toResponse(review);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ type: ReviewResponse })
  async create(
    @Body() createReviewRequest: CreateReviewRequest,
    @Req() req: Request
  ) {
    const loggedUserId = (req.user as User).id;

    const command = ReviewMapper.toCreateCommand(loggedUserId,createReviewRequest);
    const created = await this.createReviewCommandHandler.handle(command);

    return ReviewMapper.toResponse(created);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update review status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() request: UpdateReviewStatusRequest
  ) {
    const result = await this.updateReviewStatusCommandHandler.handle({
      id,
      status: request.status,
    });

    return  ReviewMapper.toResponse(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  async delete(@Param('id') id: string) {
    return this.deleteReviewCommandHandler.handle(id);
  }
}
