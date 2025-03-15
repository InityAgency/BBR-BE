import { Model, RelationMappings } from 'objection';
import { User } from 'src/modules/user/domain/user.entity';

export class Media extends Model {
  id!: string;
  fileName!: string;
  fileUrl!: string;
  mimeType!: string;
  bucketName!: string;
  uploadedBy?: string;
  createdAt!: Date;

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
