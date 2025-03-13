import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AssignPermissionCommand } from '../application/commands/assign-permission.command';
import { CreateRoleRequest } from './request/create-role.request';
import { CreateRoleCommandHandler } from '../application/commands/handlers/create-role.command.handler';
import { AssignPermissionCommandHandler } from '../application/commands/handlers/assign-permission.command.handler';
import { FetchPermissionsCommandQuery } from '../application/commands/query/fetch-permissions.command.query';
import { FetchRolesCommandQuery } from '../application/commands/query/fetch-roles.command.query';
import { FetchPermissionsQuery } from '../application/commands/fetch-permissions.query';
import { PaginationRequest } from 'src/shared/ui/request/pagination.request';
import { RoleResponse } from './response/role-response';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleCommandHandler: CreateRoleCommandHandler,
    private readonly assignPermissionCommandHandler: AssignPermissionCommandHandler,
    private readonly fetchPermissionsCommandQuery: FetchPermissionsCommandQuery,
    private readonly fetchRolesCommandQuery: FetchRolesCommandQuery
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: PaginationRequest) {
    return this.fetchRolesCommandQuery.handler(query);
  }

  @Post('create')
  async createRole(@Body() command: CreateRoleRequest) {
    const role = await this.createRoleCommandHandler.handler(command);

    return new RoleResponse(role);
  }

  @Post(':roleId/assign-permission/:permissionId')
  async assignPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string
  ) {
    const command = new AssignPermissionCommand(roleId, permissionId);
    return this.assignPermissionCommandHandler.handler(command);
  }

  @Get(':roleId/permissions')
  async getPermissions(@Param('roleId') roleId: string) {
    const query = new FetchPermissionsQuery(roleId);
    return this.fetchPermissionsCommandQuery.handler(query);
  }
}
