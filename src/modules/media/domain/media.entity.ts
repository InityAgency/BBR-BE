import { Model, RelationMappings } from 'objection';
import { User } from 'src/modules/user/domain/user.entity';

export class Media extends Model {
  id!: string;
  file_name!: string;
  file_url!: string;
  mime_type!: string;
  bucket_name!: string;
  uploaded_by?: string;
  created_at!: Date;

  static tableName = 'media';

  static relationMappings: RelationMappings = {
    uploadedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'media.uploaded_by',
        to: 'users.id',
      },
    },
  };
}
