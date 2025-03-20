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
import { MediaRepository } from '../media/infrastructure/media.repository';

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
      useClass: MediaRepository,
    },
    CreateBrandCommandHandler,
    FindByIdBrandCommandHandler,
    FetchAllBrandCommandHandler,
    UpdateBrandCommandHandler,
    DeleteBrandCommandHandler,
  ],
})
export class BrandModule {}
