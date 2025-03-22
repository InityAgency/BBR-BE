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
import { SignInCommandHandler } from './application/handlers/sign-in.command.handler';
import { SignUpBuyerCommandHandler } from './application/handlers/sign-up-buyer.command.handler';
import { SignUpDeveloperCommandHandler } from './application/handlers/sign-up-developer.command.handler';
import { SignUpGoogleCommandHandler } from './application/handlers/sign-up-google.command.handler';
import { ValidateUserCommandHandler } from './application/handlers/validate-user.command.handler';
import { RequestPasswordCommandHandler } from './application/handlers/request-password.command.handler';
import { ResetPasswordCOmmandHandler } from './application/handlers/reset-password.command.handler';
import { VerifyResetOtpCommandHandler } from './application/handlers/verify-reset-otp.command.handler';
import { IPasswordResetRequestRepository } from './domain/password-reset-request.repository.interface';
import { passwordResetRequestRepository } from './infrastructure/password-reset-request.repository';
import { SendResetPasswordEmailCommandHandler } from '../email/application/send-reset-password-email.command.handler';
import { IEmailRepository } from '../email/domain/email.repository.interface';
import { EmailRepository } from '../email/infrastructure/email.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    {
      provide: IPasswordResetRequestRepository,
      useClass: passwordResetRequestRepository,
    },
    {
      provide: IEmailRepository,
      useClass: EmailRepository,
    },
    LocalStrategy,
    SessionSerializer,
    UserRepositoryImpl,
    GoogleStrategy,
    FindByEmailQueryHandler,
    SignInCommandHandler,
    SignUpBuyerCommandHandler,
    SignUpDeveloperCommandHandler,
    SignUpGoogleCommandHandler,
    ValidateUserCommandHandler,
    RequestPasswordCommandHandler,
    ResetPasswordCOmmandHandler,
    VerifyResetOtpCommandHandler,
    SendResetPasswordEmailCommandHandler,
  ],
  exports: [],
})
export class AuthModule {}
