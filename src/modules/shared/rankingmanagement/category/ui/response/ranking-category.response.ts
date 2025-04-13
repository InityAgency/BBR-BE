import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategoryTypeResponse } from '../../../categorytype/ui/response/ranking-category-type.response';

export class RankingCategoryResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly title: string,
    public readonly description: string,
    public readonly rankingCategoryType: RankingCategoryTypeResponse,
    public readonly residenceLimitation: number,
    public readonly rankingPrice: number,
    public readonly featuredImage: MediaResponse | null,
    public readonly status: string
  ) {}
}
