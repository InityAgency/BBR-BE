import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UserRepositoryImpl } from '../user/infrastructure/user.repository';
import { SessionSerializer } from './application/serializers/session.serializer';
import { GoogleStrategy } from './application/strategies/google.strategy';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthRepository } from './infrastructure/auth.repository';
import { AuthController } from './ui/auth.controller';
import { IAuthRepository } from './domain/auth.repository.interface';
import { FindByEmailQueryHandler } from './application/query/find-by-email.command.query';
import { ForgotPasswordCommandHandler } from './application/handlers/forgot-password.command.handler';
import { SignInCommandHandler } from './application/handlers/sign-in.command.handler';
import { SignUpBuyerCommandHandler } from './application/handlers/sign-up-buyer.command.handler';
import { SignUpDeveloperCommandHandler } from './application/handlers/sign-up-developer.command.handler';
import { SignUpGoogleCommandHandler } from './application/handlers/sign-up-google.command.handler';
import { ValidateUserCommandHandler } from './application/handlers/validate-user.command.handler';

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
    FindByEmailQueryHandler,
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
