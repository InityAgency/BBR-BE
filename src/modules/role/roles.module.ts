import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { PubSubService } from '../../shared/messaging/pubsub.service';
import { AssignPermissionCommandHandler } from './application/commands/handlers/assign-permission.command.handler';
import { CreateRoleCommandHandler } from './application/commands/handlers/create-role.command.handler';
import { FetchPermissionsCommandQuery } from './application/commands/query/fetch-permissions.command.query';
import { FetchRolesCommandQuery } from './application/commands/query/fetch-roles.command.query';
import { IRoleRepository } from './domain/role.repository.interface';
import { RoleRepositoryImpl } from './infrastructure/role.repository';
import { RoleController } from './ui/role.controller';
@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    PubSubService,
    AssignPermissionCommandHandler,
    FetchPermissionsCommandQuery,
    CreateRoleCommandHandler,
    FetchRolesCommandQuery,
  ],
  exports: [],
})
export class RoleModule {}
