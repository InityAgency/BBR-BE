import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UserModule } from './usermanagement/user.module';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';
import { RestExceptionHandler } from './shared/error/handler/rest.exception.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath will be handled by dotenv-cli, so no need to specify here
    }),
    // DatabaseModule,
    UserModule,
    LoggerModule,
  ],
  providers: [RestExceptionHandler],
})
export class AppModule {}
