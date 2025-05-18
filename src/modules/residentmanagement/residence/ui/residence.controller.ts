import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query, Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CreateResidenceCommand } from '../application/commands/create-residence.command';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { UpdateResidenceStatusCommand } from '../application/commands/update-residence-status.command';
import { UpdateResidenceCommand } from '../application/commands/update-residence.command';
import { CreateResidenceCommandHandler } from '../application/handlers/create-residence.command.handler';
import { DeleteResidenceCommandHandler } from '../application/handlers/delete-residence.command.handler';
import { UpdateResidenceCommandHandler } from '../application/handlers/update-residence.command.handler';
import { UpdateResidenceStatusCommandHandler } from '../application/handlers/update-status-residence.command.handler';
import { FindAllResidencesCommandQuery } from '../application/query/find-all-residences.query';
import { FindByIdResidenceCommandQuery } from '../application/query/find-by-id-residence.query';
import { ResidenceStatusEnum } from '../domain/residence-status.enum';
import { ResidenceMapper } from './mappers/residence.mapper';
import { CreateResidenceRequest } from './request/create-residence.request';
import { UpdateResidenceRequest } from './request/update-residence.request';
import { ResidenceResponse } from './response/residence.response';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { Request } from 'express';
import { User } from '../../../user/domain/user.entity';

ApiTags('Residence');
@Controller('residences')
@ApiBearerAuth()
export class ResidenceController {
  constructor(
    private readonly createResidenceCommandHandler: CreateResidenceCommandHandler,
    private readonly updateResidenceCommandHandler: UpdateResidenceCommandHandler,
    private readonly updateResidenceStatusCommandHandler: UpdateResidenceStatusCommandHandler,
    private readonly deleteResidenceCommandHandler: DeleteResidenceCommandHandler,
    private readonly findAllResidencesCommandQuery: FindAllResidencesCommandQuery,
    private readonly findByIdResidenceCommandQuery: FindByIdResidenceCommandQuery
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
    @Query('status') status?: ResidenceStatusEnum[],
    @Query('developmentStatus') developmentStatus?: DevelopmentStatusEnum[],
    @Query('cityId') cityId?: string[]
  ): Promise<{ data: ResidenceResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchResidencesQuery(
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      developmentStatus,
      cityId
    );

    const { data, pagination } = await this.findAllResidencesCommandQuery.handle(fetchQuery);

    return {
      data: data.map((residence) => ResidenceMapper.toResponse(residence)),
      pagination,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new residence' })
  @ApiResponse({ status: 201, description: 'Residence created', type: ResidenceResponse })
  async create(@Body() request: CreateResidenceRequest,  @Req() req: Request): Promise<ResidenceResponse> {
    const user = req.user as User;
    let loggedDeveloperId: string | undefined = undefined;

    console.log(user);

    if (user.role?.name?.toLowerCase() === 'developer') {
      loggedDeveloperId = user.id;
    }
    console.log(user.role);

    const command = new CreateResidenceCommand(
      request.name,
      request.slug,
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
      request.companyId,
      request.mainGallery,
      request.secondaryGallery,
      request.highlightedAmenities,
      loggedDeveloperId
    );

    const created = await this.createResidenceCommandHandler.handle(command);

    return ResidenceMapper.toResponse(created);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a residence status' })
  @ApiResponse({ status: 200, description: 'Residence status updated', type: ResidenceResponse })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ResidenceStatusEnum
  ): Promise<void> {
    const command = new UpdateResidenceStatusCommand(id, status);
    await this.updateResidenceStatusCommandHandler.handle(command);
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
      request.slug,
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
      request.companyId,
      request.mainGallery,
      request.secondaryGallery,
      request.highlightedAmenities
    );

    const created = await this.updateResidenceCommandHandler.handle(command);
    return ResidenceMapper.toResponse(created);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a residence by id' })
  @ApiResponse({ status: 200, description: 'Residence found', type: ResidenceResponse })
  async findById(@Param('id') id: string): Promise<ResidenceResponse> {
    const residence = await this.findByIdResidenceCommandQuery.handle(id);
    return ResidenceMapper.toResponse(residence);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a residence' })
  @ApiResponse({ status: 200, description: 'Residence deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteResidenceCommandHandler.handle(id);
  }
}
