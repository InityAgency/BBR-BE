import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';

export class Company extends Model {
  id!: string;
  name!: string;
  address?: string;
  logo?: string;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  website?: string;
  contactPersonAvatar?: string;
  contactPersonFullName?: string;
  contactPersonJobTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhoneNumber?: string;
  contactPersonPhoneNumberCountryCode?: string;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'company';

  static relationMappings: RelationMappings = {
    logo: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'company.logo',
        to: 'media.id',
      },
    },
    contactPersonAvatar: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'company.contact_person_avatar',
        to: 'media.id',
      },
    },
  };
}
