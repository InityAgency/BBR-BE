import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AssignPermissionCommand } from '../application/commands/assign-permission.command';
import { GetPermissionsQuery } from '../application/commands/get-permissions.query';
import { AssignPermissionHandler } from '../application/commands/handlers/assign-permission.handler';
import { CreateRoleHandler } from '../application/commands/handlers/create-role.handler';
import { getPermissionsQuery } from '../application/commands/query/get-permissions.query';
import { CreateRoleRequest } from './request/create-role.request';
import { GetRolesQuery } from '../application/commands/query/get-roles.query';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleHandler: CreateRoleHandler,
    private readonly assignPermissionHandler: AssignPermissionHandler,
    private readonly getPermissionsQuery: getPermissionsQuery,
    private readonly getRolesQuery: GetRolesQuery
  ) {}

  @Get()
  async findAll() {
    return this.getRolesQuery.handler();
  }

  @Post('create')
  async createRole(@Body() command: CreateRoleRequest) {
    return this.createRoleHandler.handler(command);
  }

  @Post(':roleId/assign-permission/:permissionId')
  async assignPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string
  ) {
    const command = new AssignPermissionCommand(roleId, permissionId);
    return this.assignPermissionHandler.handler(command);
  }

  @Get(':roleId/permissions')
  async getPermissions(@Param('roleId') roleId: string) {
    const query = new GetPermissionsQuery(roleId);
    return this.getPermissionsQuery.handler(query);
  }
}
