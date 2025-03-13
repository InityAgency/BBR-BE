import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UserRepositoryImpl } from '../user/infrastructure/user.repository';
import { FindByEmailCommandHandler } from './application/commands/handlers/find-by-email.command.handler';
import { ForgotPasswordCommandHandler } from './application/commands/handlers/forgot-password.command.handler';
import { SignInCommandHandler } from './application/commands/handlers/sign-in.command.handler';
import { SignUpBuyerCommandHandler } from './application/commands/handlers/sign-up-buyer.command.handler';
import { SignUpDeveloperCommandHandler } from './application/commands/handlers/sign-up-developer.command.handler';
import { ValidateUserCommandHandler } from './application/commands/handlers/validate-user.command.handler';
import { SessionSerializer } from './application/serializers/session.serializer';
import { GoogleStrategy } from './application/strategies/google.strategy';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthRepository } from './infrastructure/auth.repository';
import { AuthController } from './ui/auth.controller';
import { SignUpGoogleCommandHandler } from './application/commands/handlers/sign-up-google.command.handler';
import { IAuthRepository } from './domain/auth.repository.interface';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    LocalStrategy,
    SessionSerializer,
    UserRepositoryImpl,
    GoogleStrategy,
    FindByEmailCommandHandler,
    ForgotPasswordCommandHandler,
    SignInCommandHandler,
    SignUpBuyerCommandHandler,
    SignUpDeveloperCommandHandler,
    SignUpGoogleCommandHandler,
    ValidateUserCommandHandler,
  ],
  exports: [],
})
export class AuthModule {}
