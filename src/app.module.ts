import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { BrandTypesModule } from './modules/brand_types/brand-types.module';
import { CompanyModule } from './modules/company/company.module';
import { MediaModule } from './modules/media/media.module';
import { RoleModule } from './modules/role/roles.module';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from './shared/cache/redis.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';
import { ABACMiddleware } from './shared/middleware/abac.middleware';
import { RBACMiddleware } from './shared/middleware/rbac.middleware';
import EmailModule from './modules/email/email.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath will be handled by dotenv-cli, so no need to specify here
    }),
    UserModule,
    AuthModule,
    RoleModule,
    CompanyModule,
    MediaModule,
    LoggerModule,
    DatabaseModule,
    CacheModule,
    BrandModule,
    BrandTypesModule,
    EmailModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RBACMiddleware, ABACMiddleware).forRoutes('{*path}');
  }
}
