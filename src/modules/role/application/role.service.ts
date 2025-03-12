import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '../domain/role.repository.interface';
import { RedisService } from 'src/shared/cache/redis.service';
import { PubSubService } from 'src/shared/messaging/pubsub.service';
import { Role } from '../domain/role.entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly redisService: RedisService,
    private readonly pubSubService: PubSubService
  ) {}

  async createRole(name: string): Promise<Role> {
    const role = await this.roleRepository.createRole(name);

    // 🚀 Invalidate cache across all servers
    await this.redisService.delCache('roles-list');
    await this.pubSubService.invalidateCache('roles-list');

    return role;
  }

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    await this.roleRepository.assignPermission(roleId, permissionId);

    // 🚀 Invalidate cache for updated role
    await this.redisService.delCache(`role-permissions:${roleId}`);
    await this.pubSubService.invalidateCache(`role-permissions:${roleId}`);
  }

  async getPermissions(roleId: string): Promise<string[]> {
    // Check cache first
    const cachedPermissions = await this.redisService.getCache(`role-permissions:${roleId}`);
    if (cachedPermissions) return cachedPermissions;

    const permissions = await this.roleRepository.getPermissions(roleId);

    // Store in cache
    await this.redisService.setCache(`role-permissions:${roleId}`, permissions, 3600);

    return permissions;
  }
}
