import { Module } from '@nestjs/common';
import { CreateUserCommandHandler } from './application/create-user.command.handler';
import { FetchUsersCommandHandler } from './application/fetch-users-command-handler';
import { FindByIdUserCommandHandler } from './application/find-by-id-user.command.handler';
import { DeleteUserCommandHandler } from './application/delete-user.command.handler';
import { UpdateUserCommandHandler } from './application/update-user-command-handler';
import { UserRepositoryImpl } from './infrastructure/user.repository';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UserController } from './ui/user.controller';
import { IUserRepository } from './domain/user.repository.interface';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    CreateUserCommandHandler,
    FetchUsersCommandHandler,
    FindByIdUserCommandHandler,
    DeleteUserCommandHandler,
    UpdateUserCommandHandler,
  ],
})
export class UserModule {}
