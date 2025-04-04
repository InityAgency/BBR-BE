import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateResidenceRequest } from './request/create-residence.request';
import { ResidenceResponse } from './response/residence.response';
import { CreateResidenceCommand } from '../application/commands/create-residence.command';
import { CreateResidenceCommandHandler } from '../application/handlers/create-residence.command.handler';
import { Residence } from '../domain/residence.entity';
import { ResidenceMapper } from './mappers/residence.mapper';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { FindAllResidencesQueryHandler } from '../application/query/find-all-residences.query.handler';
import { ResidenceStatusEnum } from '../domain/residence-status.enum';
import { OrderByDirection } from 'objection';
import { UpdateResidenceCommand } from '../application/commands/update-residence.command';
import { UpdateResidenceRequest } from './request/update-residence.request';
import { UpdateResidenceCommandHandler } from '../application/handlers/update-residence.command.handler';

ApiTags('Residence');
@Controller('residences')
export class ResidenceController {
  constructor(
    private readonly createResidenceHandler: CreateResidenceCommandHandler,
    private readonly updateResidenceCommandHandler: UpdateResidenceCommandHandler,
    private readonly findAllResidencesQueryHandler: FindAllResidencesQueryHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all residences' })
  @ApiResponse({
    status: 200,
    description: 'List of residences',
    type: ResidenceResponse,
    isArray: true,
  })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('status') status?: ResidenceStatusEnum
  ): Promise<{ data: ResidenceResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchResidencesQuery(query, page, limit, sortBy, sortOrder, status);

    const { data, pagination } = await this.findAllResidencesQueryHandler.handle(fetchQuery);

    return {
      data: data.map((residence) => ResidenceMapper.toResponse(residence)),
      pagination,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new residence' })
  @ApiResponse({ status: 201, description: 'Residence created', type: ResidenceResponse })
  async create(@Body() request: CreateResidenceRequest): Promise<ResidenceResponse> {
    const command = new CreateResidenceCommand(
      request.name,
      request.websiteUrl,
      request.subtitle,
      request.description,
      request.budgetStartRange,
      request.budgetEndRange,
      request.address,
      request.latitude,
      request.longitude,
      request.brandId,
      request.countryId,
      request.cityId
    );

    const created = await this.createResidenceHandler.handle(command);

    return ResidenceMapper.toResponse(created);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a residence' })
  @ApiResponse({ status: 200, description: 'Residence updated', type: ResidenceResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateResidenceRequest
  ): Promise<ResidenceResponse> {
    const command = new UpdateResidenceCommand(
      id,
      request.name,
      request.websiteUrl,
      request.subtitle,
      request.description,
      request.budgetStartRange,
      request.budgetEndRange,
      request.address,
      request.latitude,
      request.longitude,
      request.brandId,
      request.countryId,
      request.cityId,
      request.rentalPotential,
      request.developmentStatus,
      request.yearBuilt,
      request.floorSqft,
      request.staffRatio,
      request.avgPricePerUnit,
      request.avgPricePerSqft,
      request.petFriendly,
      request.disabledFriendly,
      request.videoTourUrl,
      request.videoTourId,
      request.featuredImageId,
      request.keyFeatures,
      request.amenities,
      request.companyId
    );

    const created = await this.updateResidenceCommandHandler.handle(command);
    return ResidenceMapper.toResponse(created);
  }
}
