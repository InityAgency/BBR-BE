import { Model, RelationMappings } from 'objection';
import { Country } from 'src/modules/country/domain/country.entity';
import { Lifestyle } from 'src/modules/lifestyles/domain/lifestyle.entity';
import { UnitType } from 'src/modules/unit_types/domain/unit_type.entity';

export class UserBuyer extends Model {
  userId!: string;
  avatar?: string;
  currentLocation?: string;
  budgetRangeFrom?: string;
  budgetRangeTo?: string;
  phoneNumber?: string;
  preferredContactMethod?: string;
  preferredResidenceLocation?: string;

  static tableName = 'user_buyers';

  static relationMappings: RelationMappings = {
    currentLocation: {
      relation: Model.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: 'user_buyers.currentLocation',
        to: 'countries.id',
      },
    },
    unitTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: UnitType,
      join: {
        from: 'user_buyers.userId',
        through: {
          from: 'user_buyer_unit_types.userId',
          to: 'user_buyer_unit_types.unitTypeId',
        },
        to: 'unit_types.id',
      },
    },
    lifestyles: {
      relation: Model.ManyToManyRelation,
      modelClass: Lifestyle,
      join: {
        from: 'user_buyers.userId',
        through: {
          from: 'user_buyer_lifestyles.userId',
          to: 'user_buyer_lifestyles.lifestylesId',
        },
        to: 'lifestyles.id',
      },
    },
    preferredResidenceLocation: {
      relation: Model.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: 'user_buyers.preferredResidenceLocation',
        to: 'countries.id',
      },
    },
  };
}
