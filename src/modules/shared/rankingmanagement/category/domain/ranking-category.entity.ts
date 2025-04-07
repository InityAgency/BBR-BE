import { Model } from 'objection';
import { RankingCategoryStatus } from './ranking-category-status.enum';
import { RankingCategoryType } from '../../categorytype/domain/ranking-category-type.entity';
import { Media } from '../../../../media/domain/media.entity';

export class RankingCategory extends Model {
  id!: string;
  name!: string;
  description!: string;
  rankingCategoryType!: RankingCategoryType;
  residenceLimitation!: number;
  rankingPrice!: number;
  featuredImage!: Media;
  status!: RankingCategoryStatus;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  rankingCategoryTypeId!: string;

  static tableName = 'ranking_categories';

  static relationMappings = {
    rankingCategoryType: {
      relation: Model.BelongsToOneRelation,
      modelClass: RankingCategoryType,
      join: {
        from: 'ranking_categories.rankingCategoryTypeId',
        to: 'ranking_category_types.id',
      },
    },
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'ranking_categories.featuredImageId',
        to: 'media.id',
      },
    },
  };

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
