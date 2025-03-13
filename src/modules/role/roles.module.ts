import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { PubSubService } from '../../shared/messaging/pubsub.service';
import { AssignPermissionHandler } from './application/commands/handlers/assign-permission.handler';
import { CreateRoleHandler } from './application/commands/handlers/create-role.handler';
import { getPermissionsQuery } from './application/commands/query/get-permissions.query';
import { IRoleRepository } from './domain/role.repository.interface';
import { RoleRepositoryImpl } from './infrastructure/role.repository';
import { RoleController } from './ui/role.controller';
import { GetRolesQuery } from './application/commands/query/get-roles.query';
@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    PubSubService,
    AssignPermissionHandler,
    getPermissionsQuery,
    CreateRoleHandler,
    GetRolesQuery,
  ],
  exports: [],
})
export class RoleModule {}
