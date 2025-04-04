import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class CreateRankingCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly rankingCategoryTypeId: string,
    public readonly residenceLimitation: string,
    public readonly rankingPrice: number,
    public readonly featuredImageId: string,
    public readonly status: RankingCategoryStatus
  ) {}
}
