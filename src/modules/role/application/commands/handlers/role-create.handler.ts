import { RedisService } from 'src/shared/cache/redis.service';
import { PubSubService } from 'src/shared/messaging/pubsub.service';
import { CreateRoleCommand } from '../create-role.command';
import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';
import { Role } from 'src/modules/role/domain/role.entity';

export class CreateRoleHandler {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly redisService: RedisService,
    private readonly pubSubService: PubSubService
  ) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    const role = await this.roleRepository.createRole(command.name);

    // Invalidate cache across all servers
    await this.redisService.delCache('roles-list');
    await this.pubSubService.invalidateCache('roles-list');

    return role;
  }
}
