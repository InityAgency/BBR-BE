import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategory } from '../../domain/ranking-category.entity';
import { RankingCategoryResponse } from '../response/ranking-category.response';
import { RankingCategoryTypeResponse } from '../../../categorytype/ui/response/ranking-category-type.response';
import { CreateRankingCategoryRequest } from '../request/create-ranking-category.request';
import { CreateRankingCategoryCommand } from '../../application/command/create-ranking-category.command';
import { UpdateRankingCategoryRequest } from '../request/update-ranking-category.request';
import { UpdateRankingCategoryCommand } from '../../application/command/update-ranking-category.command';
import { UpdateRankingCategoryStatusCommand } from '../../application/command/update-ranking-category-status.command';
import { UpdateRankingCategoryStatusRequest } from '../request/update-ranking-category-status.request';

export class RankingCategoryMapper {
  static toCreateCommand(request: CreateRankingCategoryRequest): CreateRankingCategoryCommand {
    return new CreateRankingCategoryCommand(
      request.name,
      request.description,
      request.rankingCategoryTypeId,
      request.residenceLimitation,
      request.rankingPrice,
      request.featuredImageId,
      request.status
    );
  }

  static toUpdateCommand(
    id: string,
    request: UpdateRankingCategoryRequest
  ): UpdateRankingCategoryCommand {
    return new UpdateRankingCategoryCommand(
      id,
      request.name,
      request.description,
      request.rankingCategoryTypeId,
      request.residenceLimitation,
      request.rankingPrice,
      request.featuredImageId,
      request.status
    );
  }

  static toUpdateStatusCommand(
    id: string,
    request: UpdateRankingCategoryStatusRequest
  ): UpdateRankingCategoryStatusCommand {
    return new UpdateRankingCategoryStatusCommand(id, request.status);
  }
  static toResponse(rankingCategory: RankingCategory): RankingCategoryResponse {
    return new RankingCategoryResponse(
      rankingCategory.id,
      rankingCategory.name,
      rankingCategory.description,
      new RankingCategoryTypeResponse(
        rankingCategory.rankingCategoryType.id,
        rankingCategory.rankingCategoryType.name
      ),
      rankingCategory.residenceLimitation,
      rankingCategory.rankingPrice,
      rankingCategory.featuredImage
        ? new MediaResponse(
            rankingCategory.featuredImage.id,
            rankingCategory.featuredImage.originalFileName,
            rankingCategory.featuredImage.mimeType,
            rankingCategory.featuredImage.uploadStatus,
            rankingCategory.featuredImage.size,
            rankingCategory.featuredImage.securedUrl
          )
        : null,
      rankingCategory.status
    );
  }
}
