import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '../domain/role.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { Role } from '../domain/role.entity';

@Injectable()
export class RoleRepositoryImpl implements IRoleRepository {
  constructor(private readonly knexService: KnexService) {}

  async createRole(name: string): Promise<Role> {
    const [role] = await this.knexService.connection('roles').insert({ name }).returning('*');

    return new Role(role);
  }

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    await this.knexService
      .connection('role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId });
  }

  async getPermissions(roleId: string): Promise<string[]> {
    const permissions = await this.knexService
      .connection('role_permissions as rp')
      .select('p.name')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('rp.role_id', roleId);

    return permissions.map((p) => p.name);
  }

  async getRoles() {
    return this.knexService.connection('roles').select('*');
  }
}
