import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { PubSubService } from '../../shared/messaging/pubsub.service';
import { RoleController } from './ui/role.controller';
import { RoleRepositoryImpl } from './infrastructure/role.repository';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { RedisService } from 'src/shared/cache/redis.service';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IRoleRepository } from './domain/role.repository.interface';

@Module({
  imports: [DatabaseModule],
  providers: [
    RoleService,
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    PubSubService,
  ],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
