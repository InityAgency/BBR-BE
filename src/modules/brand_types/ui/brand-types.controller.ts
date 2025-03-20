import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBrandTypesCommand } from '../application/command/create-brand-type.command';
import { CreateBrandTypesCommandHandler } from '../application/create-brand-type.command.handle';
import { FetchAllBrandTypesQueryHandler } from '../application/fetch-all-brands.command.query';
import { BrandTypeResponse } from './response/brand-type.response';
import { CreateBrandTypeRequest } from './request/create-brand-type.request';

@ApiTags('Brand Types')
@Controller('brand-types')
export class BrandTypesController {
  constructor(
    private readonly fetchAllBrandTypesHandler: FetchAllBrandTypesQueryHandler,
    private readonly createBrandTypesHandler: CreateBrandTypesCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all brand types' })
  async findAll() {
    return await this.fetchAllBrandTypesHandler.handle();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new brand type' })
  async create(@Body() request: CreateBrandTypeRequest): Promise<BrandTypeResponse> {
    const command = new CreateBrandTypesCommand(request.name);
    const brand = await this.createBrandTypesHandler.handle(command);

    return new BrandTypeResponse(brand.id, brand.name, brand.createdAt, brand.updatedAt);
  }
}
