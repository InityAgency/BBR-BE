import { Model } from 'objection';
import { Residence } from '../../residence/domain/residence.entity';
import { RankingCategory } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.entity';

export class ResidenceRankingScore extends Model {
  id!: string;
  residenceId!: string;
  rankingCategoryId!: string;
  score!: number;
  position?: number;

  static tableName = 'residence_ranking_score';

  static relationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_ranking_score.residence_id',
        to: 'residences.id',
      },
    },
    rankingCategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'residence_ranking_score.ranking_category_id',
        to: 'ranking_categories.id',
      },
    },
  };
}
