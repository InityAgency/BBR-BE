import { Injectable } from '@nestjs/common';
import { Residence } from '../domain/residence.entity';
import { IResidenceRepository } from '../domain/residence.repository.interface';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';

@Injectable()
export class ResidenceRepositoryImpl implements IResidenceRepository {
  async findByCriteria(criteria: any): Promise<Residence[]> {
    let query = Residence.query()
      .whereNull('residences.deletedAt')
      .where('residences.status', ResidenceStatusEnum.ACTIVE);

    // String/ID fields
    if (criteria.name) {
      query = query.where('name', 'ilike', `%${criteria.name}%`);
    }
    if (criteria.developmentStatus) {
      query = query.where('development_status', 'ilike', `%${criteria.developmentStatus}%`);
    }
    if (criteria.description) {
      query = query.where('description', 'ilike', `%${criteria.description}%`);
    }
    if (criteria.address) {
      query = query.where('address', 'ilike', `%${criteria.address}%`);
    }
    if (criteria.websiteUrl) {
      query = query.where('website_url', 'ilike', `%${criteria.websiteUrl}%`);
    }
    if (criteria.yearBuilt) {
      query = query.where('year_built', criteria.yearBuilt);
    }

    // Number range fields
    if (criteria.budgetStartRange) {
      query = query.where('budget_start_range', '>=', criteria.budgetStartRange);
    }
    if (criteria.budgetEndRange) {
      query = query.where('budget_end_range', '<=', criteria.budgetEndRange);
    }
    if (criteria.floorSqft) {
      query = query.where('floor_sqft', '>=', criteria.floorSqft);
    }
    if (criteria.staffRatio) {
      query = query.where('staff_ratio', '>=', criteria.staffRatio);
    }
    if (criteria.avgPricePerUnit) {
      query = query.where('avg_price_per_unit', '<=', criteria.avgPricePerUnit);
    }
    if (criteria.avgPricePerSqft) {
      query = query.where('avg_price_per_sqft', '<=', criteria.avgPricePerSqft);
    }

    // Enum or simple value fields
    if (criteria.rentalPotential) {
      query = query.where('rental_potential', criteria.rentalPotential);
    }
    if (typeof criteria.petFriendly === 'boolean') {
      query = query.where('pet_friendly', criteria.petFriendly);
    }
    if (typeof criteria.disabledFriendly === 'boolean') {
      query = query.where('disabled_friendly', criteria.disabledFriendly);
    }

    // Foreign key/object fields (support both object or id)
    if (criteria.continent) {
      query = query
        .joinRelated('country.continent')
        .where('country:continent.name', 'ilike', `%${criteria.continent}%`);
    }
    if (criteria.subregion) {
      query = query
        .joinRelated('country')
        .where('country.subregion', 'ilike', `%${criteria.subregion}%`);
    }
    if (criteria.country) {
      const val =
        typeof criteria.country === 'string'
          ? criteria.country
          : criteria.country.name || criteria.country.id || criteria.country;
      query = query.joinRelated('country').where('country.name', 'ilike', `%${val}%`);
    }

    if (criteria.city) {
      const val =
        typeof criteria.city === 'string'
          ? criteria.city
          : criteria.city.name || criteria.city.id || criteria.city;
      query = query.joinRelated('city').where('city.name', 'ilike', `%${val}%`);
    }
    if (criteria.brand) {
      const val =
        typeof criteria.brand === 'string'
          ? criteria.brand
          : criteria.brand.name || criteria.brand.id || criteria.brand;
      query = query.joinRelated('brand').where('brand.name', 'ilike', `%${val}%`);
    }
    if (criteria.company) {
      const val =
        typeof criteria.company === 'string'
          ? criteria.company
          : criteria.company.name || criteria.company.id || criteria.company;
      query = query.joinRelated('companies').where('company.name', 'ilike', `%${val}%`);
    }

    // Arrays/Relations
    if (criteria.amenities?.length) {
      query = query.joinRelated('amenities').where(function () {
        for (const val of criteria.amenities) {
          const name = typeof val === 'string' ? val : val.name || val.id || val;
          this.orWhere('amenities.name', 'ilike', `%${name}%`);
        }
      });
    }

    // if (criteria.highlightedAmenities?.length) {
    //   query = query.joinRelated('highlightedAmenities').where(function () {
    //     for (const val of criteria.highlightedAmenities) {
    //       const name = typeof val === 'string' ? val : val.name || val.id || val;
    //       this.orWhere('highlightedAmenities.name', 'ilike', `%${name}%`);
    //     }
    //   });
    // }
    if (criteria.highlightedAmenities?.length) {
      query = query.leftJoinRelated('highlightedAmenities.amenity').where(function () {
        for (const val of criteria.highlightedAmenities) {
          const name = typeof val === 'string' ? val : val.name || val.id || val;
          this.orWhere('highlightedAmenities:amenity.name', 'ilike', `%${name}%`);
        }
      });
    }

    if (criteria.keyFeatures?.length) {
      query = query.joinRelated('key_features').where(function () {
        for (const val of criteria.keyFeatures) {
          const name = typeof val === 'string' ? val : val.name || val.id || val;
          this.orWhere('keyFeatures.name', 'ilike', `%${name}%`);
        }
      });
    }

    // Units (ako trebaš, možeš dodati poseban query)
    // if (criteria.units) { ... }

    // totalScores (custom logic, može biti više score uslova)
    if (criteria.totalScores?.length) {
      for (const score of criteria.totalScores) {
        // Prvo izvučeš kategoriju (može biti id ili name)
        const cat = score.rankingCategory;
        // Filter po ID-u ili po name (fuzzy!)
        if (cat?.id && score.totalScore) {
          query = query.whereExists(
            Residence.relatedQuery('totalScores')
              .where('ranking_category_id', cat.id)
              .where('total_score', '>=', score.totalScore)
          );
        } else if (cat?.name && score.totalScore) {
          query = query.whereExists(
            Residence.relatedQuery('totalScores')
              .joinRelated('rankingCategory')
              .where('rankingCategory.name', 'ilike', `%${cat.name}%`)
              .where('total_score', '>=', score.totalScore)
          );
        }
        // Po želji, možeš dodati i filter po position, slug itd.
        if (score.position) {
          query = query.whereExists(
            Residence.relatedQuery('totalScores').where('position', score.position)
          );
        }
      }
    }

    // Limit, order, etc.
    if (criteria.orderBy) {
      query = query.orderBy(criteria.orderBy, criteria.orderDirection || 'desc');
    }
    if (criteria.limit) {
      query = query.limit(criteria.limit);
    }
    query = query.limit(10);

    // Final result
    return await query;
  }
}
