import { Module } from '@nestjs/common';
import { CreateUserCommandHandler } from './application/create-user.command.handler';
import { FetchUsersCommandHandler } from './application/fetch-users-command-handler';
import { FindByIdUserCommandHandler } from './application/find-by-id-user.command.handler';
import { DeleteUserCommandHandler } from './application/delete-user.command.handler';
import { UpdateUserCommandHandler } from './application/update-user-command-handler';
import { UserRepositoryImpl } from './infrastructure/user.repository';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UserController } from './ui/user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    CreateUserCommandHandler,
    FetchUsersCommandHandler,
    FindByIdUserCommandHandler,
    DeleteUserCommandHandler,
    UpdateUserCommandHandler,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
