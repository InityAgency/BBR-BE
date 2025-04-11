import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { MediaModule } from 'src/modules/media/media.module';
import { IUnitRepository } from './domain/unit.repository.interface';
import { UnitRepositoryImpl } from './infrastructure/unit.repository';
import { CreateUnitCommandHandler } from './application/handler/create-unit.command.handler';
import { UpdateUnitCommandHandler } from './application/handler/update-unit.command.handler';
import { FindUnitByIdCommandQuery } from './application/query/find-by-id-unit.query';
import { FetchUnitsCommandQuery } from './application/query/fetch-units.query';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { MediaRepositoryImpl } from 'src/modules/media/infrastructure/media.repository';
import { ResidenceRepositoryImpl } from './infrastructure/residence.repository';
import { UnitController } from './ui/unit.controller';
import { UnitMapper } from './ui/mapper/unit.mapper';
import { IResidenceRepository } from './domain/residence.repository.interface';
import { DeleteUnitCommandHandler } from './application/handler/delete-unit.command.handler';
import { UnitPublicController } from './ui/unit.public.controller';
import { IUnitTypeRepository } from '../unit_type/domain/unit-type.repository.interface';
import { UnitTypeRepositoryImpl } from '../unit_type/infrastructure/unit-type.repository';

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [UnitController, UnitPublicController],
  providers: [
    {
      provide: IUnitRepository,
      useClass: UnitRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    {
      provide: IUnitTypeRepository,
      useClass: UnitTypeRepositoryImpl,
    },
    CreateUnitCommandHandler,
    UpdateUnitCommandHandler,
    DeleteUnitCommandHandler,
    FindUnitByIdCommandQuery,
    FetchUnitsCommandQuery,
    UnitMapper,
  ],
})
export class UnitModule {}
