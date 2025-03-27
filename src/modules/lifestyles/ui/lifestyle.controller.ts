import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLifestyleCommand } from '../application/command/create-lifestyle.command';
import { CreateLifestyleCommandHandler } from '../application/create-lifestyle.command.handler';
import { Lifestyle } from '../domain/lifestyle.entity';
import { CreateLifestyleRequest } from './request/create-lifestyle.request';
import { UpdateLifestyleRequest } from './request/update-lifestyle.request';
import { UpdateLifestyleCommand } from '../application/command/update-lifestyle.command';
import { UpdateLifestyleCommandHandler } from '../application/update-lifestyle.command.handler';
import { DeleteLifestyleCommand } from '../application/command/delete-lifestyle.command';
import { DeleteLifestyleCommandHandler } from '../application/delete-lifestyle.command.handler';
import { FetchAllLifestylesQueryHandler } from '../application/fetch-all-lifestyles.query.handler';
import { FetchLifestyleQuery } from '../application/command/fetch-lifestyle.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FindByIdLifestyleQueryHandler } from '../application/find-by-id-lifestyle.query.handler';

@ApiTags('Lifestyles')
@Controller('lifestyles')
export class LifestyleController {
  constructor(
    private readonly createLifestyleCommandHandler: CreateLifestyleCommandHandler,
    private readonly updateLifestyleCommandHandler: UpdateLifestyleCommandHandler,
    private readonly deleteLifestyleCommandHandler: DeleteLifestyleCommandHandler,
    private readonly fetchAllLifestylesQueryHandler: FetchAllLifestylesQueryHandler,
    private readonly findByIdLifestyleQueryHandler: FindByIdLifestyleQueryHandler
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lifestyles fetched successfully', type: [Lifestyle] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: Lifestyle[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchLifestyleQuery(query, page, limit);
    return await this.fetchAllLifestylesQueryHandler.handle(fetchQuery);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'Lifestyle created successfully', type: Lifestyle })
  async create(@Body() request: CreateLifestyleRequest): Promise<Lifestyle> {
    const command = new CreateLifestyleCommand(request.name, request.imageId, request.order);

    const lifestyle = await this.createLifestyleCommandHandler.handle(command);

    return lifestyle;
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Lifestyle fetched successfully', type: Lifestyle })
  async findById(@Param('id') id: string): Promise<Lifestyle> {
    return await this.findByIdLifestyleQueryHandler.handle(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'Lifestyle updated successfully', type: Lifestyle })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateLifestyleRequest
  ): Promise<Lifestyle> {
    const command = new UpdateLifestyleCommand(id, request.name, request.imageId, request.order);

    return await this.updateLifestyleCommandHandler.handle(command);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Lifestyle deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    const command = new DeleteLifestyleCommand(id);

    await this.deleteLifestyleCommandHandler.handle(command);
  }
}
