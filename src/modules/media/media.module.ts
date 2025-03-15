import { Module } from '@nestjs/common';
import { S3Service } from './infrastructure/s3/s3.service';
import { CreateMediaCommandHandler } from './application/commands/handlers/create-media.command.handler';
import { UpdateMediaCommandHandler } from './application/commands/handlers/update-media.command.handler';
import { DeleteMediaCommandHandler } from './application/commands/handlers/delete-media.command.handler';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { MediaController } from './ui/media.controller';
import { GeneratePrestigedUrlCommandQuery } from './application/commands/query/generate-prestiged-url.command.handler';
import { IMediaRepository } from './domain/media.repository.interface';
import { MediaRepository } from './infrastructure/media.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController],
  providers: [
    {
      provide: IMediaRepository,
      useClass: MediaRepository,
    },
    S3Service,
    CreateMediaCommandHandler,
    UpdateMediaCommandHandler,
    DeleteMediaCommandHandler,
    GeneratePrestigedUrlCommandQuery,
  ],
  exports: [],
})
export class MediaModule {}
