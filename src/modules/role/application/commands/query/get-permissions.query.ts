import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';
import { RedisService } from 'src/shared/cache/redis.service';
import { PubSubService } from 'src/shared/messaging/pubsub.service';
import { GetPermissionsQuery } from '../get-permissions.query';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class getPermissionsQuery {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly redisService: RedisService
  ) {}

  @LogMethod()
  async handler(query: GetPermissionsQuery): Promise<string[]> {
    // Check cache first
    const cachedPermissions = await this.redisService.getCache(`role-permissions:${query.roleId}`);
    if (cachedPermissions) return cachedPermissions;

    const permissions = await this.roleRepository.getPermissions(query.roleId);

    // Store in cache
    await this.redisService.setCache(`role-permissions:${query.roleId}`, permissions, 3600);

    return permissions;
  }
}
