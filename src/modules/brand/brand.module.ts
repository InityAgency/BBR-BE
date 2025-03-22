import { Module } from '@nestjs/common';
import { CreateBrandCommandHandler } from './application/create-brand.command.handler';
import { FindByIdBrandCommandHandler } from './application/find-by-id-brand.command.handler';
import { FetchAllBrandCommandHandler } from './application/fetch-all-brands.command.handler';
import { UpdateBrandCommandHandler } from './application/update-brand.command.handler';
import { DeleteBrandCommandHandler } from './application/delete-brand.command.handler';
import { BrandController } from './ui/brand.controller';
import { BrandRepositoryImpl } from './infrastructure/brand.repository';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IBrandRepository } from './domain/brand.repository.interface';
import { IMediaRepository } from '../media/domain/media.repository.interface';
import { MediaRepositoryImpl } from '../media/infrastructure/media.repository';
import { UpdateBrandStatusCommandHandler } from './application/update-brand-status.command.handler';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandController],
  providers: [
    {
      provide: IBrandRepository,
      useClass: BrandRepositoryImpl,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    CreateBrandCommandHandler,
    FindByIdBrandCommandHandler,
    FetchAllBrandCommandHandler,
    UpdateBrandCommandHandler,
    DeleteBrandCommandHandler,
    UpdateBrandStatusCommandHandler
  ],
})
export class BrandModule {}
