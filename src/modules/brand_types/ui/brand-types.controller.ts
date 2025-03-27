import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBrandTypesCommand } from '../application/command/create-brand-type.command';
import { DeleteBrandTypeCommand } from '../application/command/delete-brand-type.command';
import { FetchBrandTypeByIdCommand } from '../application/command/fetch-brand-type-by-id.command';
import { UpdateBrandTypeCommand } from '../application/command/update-brand-type.command';
import { CreateBrandTypesCommandHandler } from '../application/create-brand-type.command.handler';
import { DeleteBrandTypeCommandHandler } from '../application/delete-brand-type.command.handler';
import { FetchBrandTypeByIdCommandHandler } from '../application/fetch-brand-type-by-id.comamnd.handler';
import { UpdateBrandTypeCommandHandler } from '../application/update-brand-type.command.handler';
import { CreateBrandTypeRequest } from './request/create-brand-type.request';
import { UpdateBrandTypeRequest } from './request/update-brand-type.request';
import { BrandTypeResponseWithBrands } from './response/brand-type-with-brands.response';
import { BrandTypeResponse } from './response/brand-type.response';
import { FetchAllBrandTypesQueryHandler } from '../application/fetch-all-brands.command.query.handler';

@ApiTags('Brand Types')
@Controller('brand-types')
export class BrandTypesController {
  constructor(
    private readonly fetchAllBrandTypesQueryHandler: FetchAllBrandTypesQueryHandler,
    private readonly createBrandTypesCommandHandler: CreateBrandTypesCommandHandler,
    private readonly updateBrandTypesCommandHandler: UpdateBrandTypeCommandHandler,
    private readonly deleteBrandTypesCommandHandler: DeleteBrandTypeCommandHandler,
    private readonly fetchBrandTypeByIdCommandHandler: FetchBrandTypeByIdCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all brand types' })
  async findAll() {
    const brandTypes = await this.fetchAllBrandTypesQueryHandler.handle();

    return brandTypes.map(
      (brandType) =>
        new BrandTypeResponse(
          brandType.id,
          brandType.name,
          brandType.createdAt,
          brandType.updatedAt,
          brandType.deletedAt
        )
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand type by id' })
  async findById(@Param('id') id: string): Promise<BrandTypeResponse> {
    const command = new FetchBrandTypeByIdCommand(id);
    const brandType = await this.fetchBrandTypeByIdCommandHandler.handle(command);

    return new BrandTypeResponseWithBrands(
      brandType.id,
      brandType.name,
      brandType.createdAt,
      brandType.updatedAt,
      brandType.deletedAt,
      brandType.brands
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new brand type' })
  async create(@Body() request: CreateBrandTypeRequest): Promise<BrandTypeResponse> {
    const command = new CreateBrandTypesCommand(request.name);
    const brand = await this.createBrandTypesCommandHandler.handle(command);

    return new BrandTypeResponse(
      brand.id,
      brand.name,
      brand.createdAt,
      brand.updatedAt,
      brand.deletedAt
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a brand type' })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBrandTypeRequest
  ): Promise<BrandTypeResponse> {
    const command = new UpdateBrandTypeCommand(id, request.name);
    const brand = await this.updateBrandTypesCommandHandler.handle(command);

    return new BrandTypeResponse(
      brand.id,
      brand.name,
      brand.createdAt,
      brand.updatedAt,
      brand.deletedAt
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Delete a brand type' })
  async delete(@Param('id') id: string) {
    const command = new DeleteBrandTypeCommand(id);

    await this.deleteBrandTypesCommandHandler.handle(command);
  }
}
