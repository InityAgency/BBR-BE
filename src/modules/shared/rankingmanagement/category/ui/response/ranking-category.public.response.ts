import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategoryTypeResponse } from '../../../categorytype/ui/response/ranking-category-type.response';
import { RankingCategoryTypePublicResponse } from '../../../categorytype/ui/response/ranking-category-type.public.response';

export class RankingCategoryPublicResponse {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly rankingCategoryType: RankingCategoryTypePublicResponse | null,
    public readonly featuredImage: MediaResponse | null
  ) {}
}
