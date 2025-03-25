import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { FetchAllBrandTypesQueryHandler } from './application/fetch-all-brands.command.query';
import { IBrandTypesRepository } from './domain/brand-type.repository.interface';
import { BrandTypesRepository } from './infrastructure/brand-types.repository';
import { BrandTypesController } from './ui/brand-types.controller';
import { CreateBrandTypesCommandHandler } from './application/create-brand-type.command.handler';
import { UpdateBrandTypeCommandHandler } from './application/update-brand-type.command.handler';
import { DeleteBrandTypeCommandHandler } from './application/delete-brand-type.command.handler';
import { FetchBrandTypeByIdCommandHandler } from './application/fetch-brand-type-by-id.comamnd.handler';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandTypesController],
  providers: [
    {
      provide: IBrandTypesRepository,
      useClass: BrandTypesRepository,
    },
    FetchAllBrandTypesQueryHandler,
    FetchBrandTypeByIdCommandHandler,
    CreateBrandTypesCommandHandler,
    UpdateBrandTypeCommandHandler,
    DeleteBrandTypeCommandHandler,
  ],
})
export class BrandTypesModule {}
