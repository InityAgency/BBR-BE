import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { SessionSerializer } from './application/serializers/session.serializer';
import { GoogleStrategy } from './application/strategies/google.strategy';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthController } from './ui/auth.controller';
import { AuthRepository } from './infrastructure/auth.repository';
import { IAuthRepository } from './domain/auth.repository.interface';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UserRepositoryImpl } from '../user/infrastructure/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    // {
    //   provide: IAuthRepository,
    //   useClass: AuthRepository,
    // },
    AuthRepository,
    AuthService,
    LocalStrategy,
    SessionSerializer,
    UserRepositoryImpl,
    // GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
