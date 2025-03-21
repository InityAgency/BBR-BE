import { Module } from '@nestjs/common';
import { IMediaRepository } from './domain/media.repository.interface';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { MediaRepositoryImpl } from './infrastructure/media.repository';
import { S3MediaStorage } from 'src/shared/media/storage/s3-media-storage.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AwsProperties } from 'src/shared/aws/aws-properties';
import { MediaLibraryS3Configuration } from 'src/shared/media/config/media-library-s3.configuration';
import { MediaConnect } from 'aws-sdk';
import { MediaController } from './ui/media.controller';
import { FindMediaByIdCommandQuery } from './application/query/find-media-by-id.command.query';
import { FindMediaUploadStatusByIdCommandQuery } from './application/query/find-media-status-by-id.command.query';
import { FetchContentCommandHandler } from './application/handler/fetch-content.command.handler';
import { UploadMediaCommandHandler } from './application/handler/upload-media.command.handler';
import { FileUploadService } from './infrastructure/file-upload.service';
import { SizeConfigurationFactory } from 'src/shared/media/config/size-configuration-factory';
import { SizeConfigurationModule } from 'src/shared/media/config/size.configuration.module';
import { FileUploadServiceConfiguration } from 'src/shared/media/config/file-upload-service-configuration';
import { BrandMediaStorageService } from '../brand/infrastructure/media/brand-media-storage.service';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { MediaServiceImpl } from 'src/shared/media/media.service';
import { BrandStorageConfig } from '../brand/infrastructure/media/brand-storage.config';
import { LocalMediaStorageService } from 'src/shared/media/storage/local-media.storage.service';
import { FileUploadCompletedEventHandler } from './application/eventhandler/file-upload-completed.event.handler';
import { FileUploadErrorEvent } from './domain/event/file-upload-error.event';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot(), SizeConfigurationModule],
  controllers: [MediaController],
  providers: [
    AwsProperties,
    MediaLibraryS3Configuration,
    FileUploadService,
    SizeConfigurationFactory,
    FileUploadServiceConfiguration,
    FileUploadCompletedEventHandler,
    FileUploadErrorEvent,
    UploadMediaCommandHandler,
    FetchContentCommandHandler,
    FindMediaUploadStatusByIdCommandQuery,
    FindMediaByIdCommandQuery,
    {
      provide: IMediaService,
      useClass: MediaServiceImpl,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    {
      provide: 'S3_MEDIA_STORAGE_SERVICE',
      useClass: S3MediaStorage,
    },
    {
      provide: 'LOCAL_MEDIA_STORAGE_SERVICE',
      useClass: LocalMediaStorageService,
    },
    {
      provide: 'MEDIA_DOMAIN_STORAGE_SERVICES',
      useFactory: (brandStorage: BrandMediaStorageService) => [brandStorage],
      inject: [BrandMediaStorageService],
    },

    BrandStorageConfig,
    BrandMediaStorageService,
  ],
})
export class MediaModule {}
