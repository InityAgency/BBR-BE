import { Injectable, NotFoundException } from '@nestjs/common';
import { FetchResidencesByCategoryQuery } from '../command/fetch-residences-by-cateogry.query';
import { FindRankingCategoryBySlugCommandQuery } from './find-by-slug-ranking-category.query';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';

@Injectable()
export class FetchResidencesByCategoryCommandQuery {
  constructor(private readonly rankingCategoryRespository: IRankingCategoryRepository) {}

  async handle(slug: string, query: FetchResidencesByCategoryQuery): Promise<any> {
    const isCategoryExist = await this.rankingCategoryRespository.findBySlug(slug);

    if (!isCategoryExist) {
      throw new NotFoundException('Ranking category not found');
    }

    const result = await this.rankingCategoryRespository.findResidencesByCategory(slug, query);
  }
}
