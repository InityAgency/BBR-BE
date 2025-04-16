import { Module } from '@nestjs/common';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';
import { ResidenceRepository } from 'src/modules/residentmanagement/residence/infrastructure/residence.repository';
import { FindAllRankingCriteriaForResidenceQueryHandler } from './application/query/find-all-ranking-criteria-residence-category.query.handler';
import { FindAllRankingCriteriaQueryHandler } from './application/query/find-all-ranking-criteria.query.handler';
import { IRankingCriteriaRepository } from './domain/ranking-criteria.repository.interface';
import { RankingCriteriaRepositoryImpl } from './infrastructure/ranking-criteria.repository';
import { RankingCriteriaController } from './ui/ranking-criteria.controller';
import { IRankingCategoryRepository } from '../category/domain/ranking-category.repository.interface';
import { RankingCategoryRepositoryImpl } from '../category/infrastructure/ranking-category.repository';

@Module({
  controllers: [RankingCriteriaController],
  providers: [
    {
      provide: IRankingCriteriaRepository,
      useClass: RankingCriteriaRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepository,
    },
    {
      provide: IRankingCategoryRepository,
      useClass: RankingCategoryRepositoryImpl,
    },
    FindAllRankingCriteriaForResidenceQueryHandler,
    FindAllRankingCriteriaQueryHandler,
  ],
  exports: [],
})
export class RankingCriteriaModule {}
