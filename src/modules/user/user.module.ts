import { Module } from '@nestjs/common';
import { CreateUserCommandHandler } from './application/handler/create-user.command.handler';
import { FetchUsersCommandHandler } from './application/query/fetch-users-command.query';
import { FindByIdUserCommandHandler } from './application/query/find-by-id-user.command.query';
import { DeleteUserCommandHandler } from './application/handler/delete-user.command.handler';
import { UpdateUserCommandHandler } from './application/handler/update-user-command.handler';
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
