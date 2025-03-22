import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBrandRequest } from './request/create-brand.request';
import { UpdateBrandRequest } from './request/update-brand.request';
import { BrandResponse } from './response/brand-response';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBrandCommandHandler } from '../application/create-brand.command.handler';
import { FindByIdBrandCommandHandler } from '../application/find-by-id-brand.command.handler';
import { FetchAllBrandCommandHandler } from '../application/fetch-all-brands.command.handler';
import { UpdateBrandCommandHandler } from '../application/update-brand.command.handler';
import { DeleteBrandCommandHandler } from '../application/delete-brand.command.handler';
import { UpdateBrandCommand } from '../application/command/update-brand.command';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CreateBrandCommand } from '../application/command/create-brand.command';

@ApiTags('brands')
@ApiBearerAuth()
@Controller('brands')
export class BrandController {
  constructor(
    private readonly createBrandHandler: CreateBrandCommandHandler,
    private readonly findByIdBrandHandler: FindByIdBrandCommandHandler,
    private readonly fetchAllBrandHandler: FetchAllBrandCommandHandler,
    private readonly updateBrandHandler: UpdateBrandCommandHandler,
    private readonly deleteBrandHandler: DeleteBrandCommandHandler
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully', type: BrandResponse })
  @ApiResponse({ status: 400, description: 'Bad request (validation error)' })
  @ApiResponse({ status: 409, description: 'Conflict - Brand name already exists.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Brand could not be saved.' })
  async create(@Body() request: CreateBrandRequest): Promise<BrandResponse> {
    const command = new CreateBrandCommand(
      request.name,
      request.description,
      request.brandTypeId,
      request.logoId,
      request.status,
      request.registeredAt
    );
    const brand = await this.createBrandHandler.handle(command);

    return new BrandResponse(
      brand.id,
      brand.name,
      brand.description,
      brand.status,
      brand.registeredAt,
      brand.brandTypeId,
      brand.logoId,
      brand.brandType,
      brand.logo
    );
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all brands' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'List of brands', type: [BrandResponse] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: BrandResponse[]; pagination: PaginationResponse }> {
    const query = new FetchBrandsQuery(page, limit);
    const { data, pagination } = await this.fetchAllBrandHandler.handle(query);

    return {
      data: data.map(
        (brand) =>
          new BrandResponse(
            brand.id,
            brand.name,
            brand.description,
            brand.status,
            brand.registeredAt,
            brand.brandTypeId,
            brand.logoId,
            brand.brandType,
            brand.logo
          )
      ),
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found', type: BrandResponse })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findOne(@Param('id') id: string): Promise<BrandResponse> {
    const brand = await this.findByIdBrandHandler.handle(id);
    return new BrandResponse(
      brand.id,
      brand.name,
      brand.description,
      brand.status,
      brand.registeredAt,
      brand.brandTypeId,
      brand.logoId
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand updated successfully', type: BrandResponse })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Brand could not be updated.' })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBrandRequest
  ): Promise<BrandResponse> {
    const command = new UpdateBrandCommand(
      id,
      request.name,
      request.description,
      request.brandTypeId,
      request.logoId,
      request.status,
      request.registeredAt
    );
    const brand = await this.updateBrandHandler.handle(command);
    return new BrandResponse(
      brand.id,
      brand.name,
      brand.description,
      brand.status,
      brand.registeredAt,
      brand.brandTypeId,
      brand.logoId
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiResponse({ status: 204, description: 'Brand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Brand could not be deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteBrandHandler.handle(id);
  }
}
