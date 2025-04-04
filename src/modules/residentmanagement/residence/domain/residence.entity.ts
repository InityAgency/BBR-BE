import { Model, RelationMappings } from 'objection';
import { Brand } from 'src/modules/brand/domain/brand.entity';
import { Company } from 'src/modules/company/domain/company.entity';
import { Media } from 'src/modules/media/domain/media.entity';
import { City } from 'src/modules/shared/city/domain/city.entity';
import { Country } from 'src/modules/shared/country/domain/country.entity';
import { DevelompentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';
import { Amenity } from '../../amenity/domain/amenity.entity';
import { KeyFeature } from '../../key_feature/domain/key-feature.entity';
import { ResidenceStatusEnum } from './residence-status.enum';

export class Residence extends Model {
  id!: string;
  name!: string;
  status!: ResidenceStatusEnum;
  developmentStatus!: DevelompentStatusEnum;
  subtitle!: string;
  description!: string;
  budgetStartRange!: string;
  budgetEndRange!: string;
  address!: string;
  longitude!: string;
  latitude!: string;
  websiteUrl?: string;
  yearBuilt!: string;
  floorSqft!: string;
  staffRatio!: number;
  avgPricePerUnit?: string;
  avgPricePerSqft?: string;
  rentalPotential?: RentalPotentialEnum;
  petFriendly!: boolean;
  disabledFriendly!: boolean;
  videoTourUrl?: string;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  featuredImage?: Media;
  keyFeatures?: KeyFeature[];
  country!: Country;
  city!: City;
  brand?: Brand;
  videoTour?: Media;
  amenities?: Amenity[];
  company?: Company;

  mainGallery: Media[];
  secondaryGallery: Media[];

  static tableName = 'residences';

  static relationMappings: RelationMappings = {
    keyFeatures: {
      relation: Model.ManyToManyRelation,
      modelClass: () => KeyFeature,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_key_feature_relations.residence_id',
          to: 'residence_key_feature_relations.key_feature_id',
        },
        to: 'key_features.id',
      },
    },
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'residences.featuredImageId',
        to: 'media.id',
      },
    },
    brand: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Brand,
      join: {
        from: 'residences.brandId',
        to: 'brands.id',
      },
    },
    country: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Country,
      join: {
        from: 'residences.countryId',
        to: 'countries.id',
      },
    },
    city: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => City,
      join: {
        from: 'residences.cityId',
        to: 'cities.id',
      },
    },
    videoTour: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'residences.videoTourId',
        to: 'media.id',
      },
    },
    amenities: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Amenity,
      join: {
        from: 'residences.amenityId',
        through: {
          from: 'residence_amenity_relations.residence_id',
          to: 'residence_amenity_relations.amenity_id',
        },
        to: 'amenities.id',
      },
    },
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Company,
      join: {
        from: 'residences.companyId',
        to: 'companies.id',
      },
    },
    mainGallery: {
      relation: Model.ManyToManyRelation,
      modelClass: Media,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_media.residence_id',
          to: 'residence_media.media_id',
          extra: ['media_type', 'order'],
          filter: (builder) => builder.where('media_type', 'mainGallery'),
        },
        to: 'media.id',
      },
    },
    secondaryGallery: {
      relation: Model.ManyToManyRelation,
      modelClass: Media,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_media.residence_id',
          to: 'residence_media.media_id',
          extra: ['media_type', 'order'],
          filter: (builder) => builder.where('media_type', 'secondaryGallery'),
        },
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

  static async create(data: Partial<Residence>): Promise<Residence> {
    return await Residence.query().insert(data).returning('*');
  }
}
