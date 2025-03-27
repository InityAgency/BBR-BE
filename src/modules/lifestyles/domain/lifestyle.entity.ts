import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';

export class Lifestyle extends Model {
  id!: string;
  order!: number;
  imageId?: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  image!: Media;

  static tableName = 'lifestyles';

  static relationMappings: RelationMappings = {
    image: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'lifestyles.imageId',
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

  static async create(data: Partial<Lifestyle>): Promise<Lifestyle> {
    return Lifestyle.query().insert(data).returning('*');
  }
}
