import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';

export class Lifestyle extends Model {
  id!: string;
  order!: number;
  logo?: string;
  name!: string;
  created_at!: Date;
  updated_at!: Date;

  static tableName = 'lifestyles';

  static relationMappings: RelationMappings = {
    logo: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'lifestyles.logo',
        to: 'media.id',
      },
    },
  };
}
