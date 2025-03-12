// NestJS Runtime
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnexService } from './knex.service';
import { User } from 'src/modules/user/domain/user.entity';

@Module({
  providers: [KnexService],
  exports: [KnexService],
  imports: [
    ConfigModule,
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => {
    //     const dbType = configService.get<string>('DB_TYPE');
    //     const host = configService.get<string>('DB_HOST');
    //     const port = configService.get<number>('DB_PORT');
    //     const username = configService.get<string>('DB_USERNAME');
    //     const password = configService.get<string>('DB_PASSWORD');
    //     const database = configService.get<string>('DB_DATABASE');

    //     if (!dbType || !host || !port || !username || !password || !database) {
    //       throw new Error('Missing required database configuration in .env');
    //     }

    //     return {
    //       type: dbType as 'postgres',
    //       host,
    //       port,
    //       username,
    //       password,
    //       database,
    //       // TODO: check how to include all entities
    //       entities: [User],
    //       synchronize: false,
    //       logging: true,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
})
export class DatabaseModule {}
