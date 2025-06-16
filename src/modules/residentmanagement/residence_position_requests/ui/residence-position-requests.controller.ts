import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { CreatePositionRequestCommandHandler } from '../application/handler/create-position-request.command.handler';
import { CreatePositionRequestRequest } from './request/create-position-request.request';
import { PositionRequestMapper } from './mapper/position-request.mapper';
import { User } from 'src/modules/user/domain/user.entity';

@ApiTags('Residence Position Requests')
@Controller('position-requests')
export class ResidencePositionRequestsController {
  constructor(
    private readonly createPositionRequestCommandHandler: CreatePositionRequestCommandHandler
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ, PermissionsEnum.POSITION_REQUESTS_READ_OWN)
  @ApiOperation({ summary: 'Get all position requests' })
  async fetchAll() {}

  @Post()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ, PermissionsEnum.POSITION_REQUESTS_CREATE_OWN)
  @ApiOperation({ summary: 'Create position request' })
  async create(@Req() req, @Body() request: CreatePositionRequestRequest) {
    const user = req.user as User;
    const command = PositionRequestMapper.toCreateCommand({
      residenceId: request.residenceId,
      rankingCategoryId: request.rankingCategoryId,
      requestedBy: user.id,
    });
    return this.createPositionRequestCommandHandler.handle(command);
  }
}
