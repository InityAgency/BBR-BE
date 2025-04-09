import { Model, RelationMappings } from 'objection';
import { Media } from '../../../media/domain/media.entity';
import { Residence } from './residence.entity';
import { UnitStatusEnum } from './unit-status.enum';

export class Unit extends Model {
  id!: string;
  name!: string;
  description: string;
  surface: number;
  status: UnitStatusEnum;
  regularPrice: number;
  exclusivePrice: number;
  exclusiveOfferStartDate: Date;
  exclusiveOfferEndDate: Date;
  roomType: string;
  roomAmount: number;
  type: string;
  serviceType: string;
  serviceAmount: number;
  gallery: Media[];
  featureImage: Media;
  residence: Residence;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'units';

  static relationMappings: RelationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'units.residenceId',
        to: 'residences.id',
      },
    },
    gallery: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Media,
      join: {
        from: 'units.id',
        through: {
          from: 'unit_gallery.unitId',
          to: 'unit_gallery.mediaId',
        },
        to: 'media.id',
      },
    },
    featureImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'units.featureImageId',
        to: 'media.id',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }

  getAllImages(): Media[] {
    const gallery = this.gallery;
    const feature = [this.featureImage];

    return [...gallery, ...feature];
  }
}
