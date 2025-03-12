import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RoleService } from '../application/role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole(@Body('name') name: string) {
    return this.roleService.createRole(name);
  }

  @Post(':roleId/assign-permission/:permissionId')
  async assignPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string
  ) {
    return this.roleService.assignPermission(roleId, permissionId);
  }

  @Get(':roleId/permissions')
  async getPermissions(@Param('roleId') roleId: string) {
    return this.roleService.getPermissions(roleId);
  }
}
