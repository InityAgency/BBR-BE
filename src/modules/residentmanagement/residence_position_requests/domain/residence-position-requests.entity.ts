import { Model, RelationMappings } from 'objection';
import { User } from './user.entity';
import { Residence } from './residence.entity';
import { RankingCategory } from './ranking-category.entity';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

export class ResidencePositionRequest extends Model {
  id!: string;
  residenceId!: string;
  rankingCategoryId!: string;
  requestedPosition?: number;
  requestedBy!: string;
  requestedAt!: string;
  status!: ResidencePositionRequestStatusEnum;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt!: string;
  updatedAt!: string;

  static tableName = 'residence_position_requests';

  static relationMappings: RelationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_position_requests.residence_id',
        to: 'residences.id',
      },
    },
    rankingCategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'residence_position_requests.ranking_category_id',
        to: 'ranking_categories.id',
      },
    },
    requestedByUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'residence_position_requests.requested_by',
        to: 'users.id',
      },
    },
    reviewedByUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'residence_position_requests.reviewed_by',
        to: 'users.id',
      },
    },
  };
}
