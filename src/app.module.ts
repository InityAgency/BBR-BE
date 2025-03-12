import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/roles.module';
import { PassportModule } from '@nestjs/passport';
import { RBACMiddleware } from './shared/middleware/rbac.middleware';
import { ABACMiddleware } from './shared/middleware/abac.middleware';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { KnexService } from './shared/infrastructure/database/knex.service';
import { RedisService } from './shared/cache/redis.service';
import { CacheModule } from './shared/cache/redis.module';

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
    LoggerModule,
    DatabaseModule,
    CacheModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RBACMiddleware, ABACMiddleware).forRoutes('{*path}');
  }
}
