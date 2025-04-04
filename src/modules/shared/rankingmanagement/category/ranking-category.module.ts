import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IRankingCategoryRepository } from './domain/ranking-category.repository.interface';
import { RankingCategoryRepositoryImpl } from './infrastructure/ranking-category.repository';
import { RankingCategoryController } from './ui/ranking-category.controller';
import { CreateRankingCategoryCommandHandler } from './application/handler/create-ranking-category.command.handler';
import { FindRankingCategoryByIdCommandQuery } from './application/query/find-by-id-ranking-category.query';
import { FetchRankingCategoriesCommandQuery } from './application/query/fetch-ranking-categories.query';
import { UpdateRankingCategoryCommandHandler } from './application/handler/update-ranking-category.command.handler';
import { DeleteRankingCategoryCommandHandler } from './application/handler/delete-ranking-category.command.handler';
import { UpdateRankingCategoryStatusCommandHandler } from './application/handler/update-ranking-category-status.command.handler';
import { RankingCategoryMapper } from './ui/mapper/ranking-category.mapper';
import { MediaModule } from '../../../media/media.module';
import { IRankingCategoryTypeRepository } from '../categorytype/domain/ranking-category-type.repository.interface';
import { RankingCategoryTypeRepositoryImpl } from '../categorytype/infrastructure/ranking-category-type.repository';
@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [RankingCategoryController],
  providers: [
    {
      provide: IRankingCategoryRepository,
      useClass: RankingCategoryRepositoryImpl,
    },
    {
      provide: IRankingCategoryTypeRepository,
      useClass: RankingCategoryTypeRepositoryImpl,
    },
    CreateRankingCategoryCommandHandler,
    FindRankingCategoryByIdCommandQuery,
    FetchRankingCategoriesCommandQuery,
    UpdateRankingCategoryCommandHandler,
    UpdateRankingCategoryStatusCommandHandler,
    DeleteRankingCategoryCommandHandler,
    RankingCategoryMapper,
  ],
})
export class RankingCategoryModule {}
