import { Module } from '@nestjs/common';
import { LifestyleController } from './ui/lifestyle.controller';
import { ILifestyleRepository } from './domain/lifestyle.repository.interface';
import { LifestyleRepositoryIml } from './infrastructure/lifestyle.repository';
import { CreateLifestyleCommandHandler } from './application/create-lifestyle.command.handler';
import { UpdateLifestyleCommandHandler } from './application/update-lifestyle.command.handler';
import { IMediaRepository } from '../media/domain/media.repository.interface';
import { MediaRepositoryImpl } from '../media/infrastructure/media.repository';
import { DeleteLifestyleCommandHandler } from './application/delete-lifestyle.command.handler';
import { FetchAllLifestylesQueryHandler } from './application/fetch-all-lifestyles.query.handler';
import { FindByIdLifestyleQueryHandler } from './application/find-by-id-lifestyle.query.handler';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [LifestyleController],
  providers: [
    {
      provide: ILifestyleRepository,
      useClass: LifestyleRepositoryIml,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    CreateLifestyleCommandHandler,
    UpdateLifestyleCommandHandler,
    DeleteLifestyleCommandHandler,
    FetchAllLifestylesQueryHandler,
    FindByIdLifestyleQueryHandler,
  ],
})
export class LifestyleModule {}
