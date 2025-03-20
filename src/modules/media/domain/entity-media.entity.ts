import { Model } from 'objection';
import { Media } from './media.entity';

export class EntityMedia extends Model {
  static tableName = 'entity_media';

  id!: string;
  entityId!: string;
  entityType!: string;
  mediaId!: string;
  mediaType!: string;
  order!: number;
  highlighted!: boolean;

  static relationMappings = {
    media: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'entity_media.mediaId',
        to: 'media.id',
      },
    },
  };
}
