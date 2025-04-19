import { Controller, Get, Param, Query, Post, Body, Put, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnitResponse } from './response/unit.response';
import { CreateUnitCommandHandler } from '../application/handler/create-unit.command.handler';
import { UpdateUnitCommandHandler } from '../application/handler/update-unit.command.handler';
import { DeleteUnitCommandHandler } from '../application/handler/delete-unit.command.handler';
import { UnitMapper } from './mapper/unit.mapper';
import { Unit } from '../domain/unit.entity';
import { CreateUnitRequest } from './request/create-unit.request';
import { UpdateUnitRequest } from './request/update-unit.request';
import { FindUnitByIdCommandQuery } from '../application/query/find-by-id-unit.query';
import { FetchUnitsCommandQuery } from '../application/query/fetch-units.query';
import { OrderByDirection } from 'objection';
import { FetchUnitsQuery } from '../application/command/fetch-units.query';
import { UnitStatusEnum } from '../domain/unit-status.enum';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(
    private readonly fetchUnitsCommandQuery: FetchUnitsCommandQuery,
    private readonly findUnitByIdCommandQuery: FindUnitByIdCommandQuery,
    private readonly createUnitCommandHandler: CreateUnitCommandHandler,
    private readonly updateUnitCommandHandler: UpdateUnitCommandHandler,
    private readonly deleteUnitCommandHandler: DeleteUnitCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ type: [UnitResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('unitTypeId') unitTypeId?: string[],
    @Query('status') status?: UnitStatusEnum[]
  ) {
    const { data, pagination } = await this.fetchUnitsCommandQuery.handle(
      new FetchUnitsQuery(query, page, limit, sortBy, sortOrder, unitTypeId, status)
    );

    const mappedUnits = data.map((unit: Unit) => UnitMapper.toResponse(unit));

    return {
      data: mappedUnits,
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiResponse({ type: UnitResponse })
  async findById(@Param('id') id: string) {
    const unit = await this.findUnitByIdCommandQuery.handle(id);

    return UnitMapper.toResponse(unit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a unit' })
  @ApiResponse({ type: UnitResponse })
  async create(@Body() createUnitRequest: CreateUnitRequest) {
    const command = UnitMapper.toCreateCommand(createUnitRequest);
    const createdUnit = await this.createUnitCommandHandler.handle(command);

    return UnitMapper.toResponse(createdUnit);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a unit' })
  @ApiResponse({ type: UnitResponse })
  async update(@Param('id') id: string, @Body() updateUnitRequest: UpdateUnitRequest) {
    const command = UnitMapper.toUpdateCommand(id, updateUnitRequest);
    const updatedUnit = await this.updateUnitCommandHandler.handle(command);

    return UnitMapper.toResponse(updatedUnit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit' })
  async delete(@Param('id') id: string) {
    return this.deleteUnitCommandHandler.handle(id);
  }
}
