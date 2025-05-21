import { IRankingCategoryRepository } from '../domain/ranking-category.repository.interface';
import { RankingCategory } from '../domain/ranking-category.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { KnexService } from '../../../../../shared/infrastructure/database/knex.service';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { randomUUID } from 'crypto';
import { Residence } from 'src/modules/residentmanagement/residence/domain/residence.entity';
import { FetchResidencesByCategoryQuery } from '../application/command/fetch-residences-by-category.query';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';

@Injectable()
export class RankingCategoryRepositoryImpl implements IRankingCategoryRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(rankingCategory: Partial<RankingCategory>): Promise<RankingCategory | undefined> {
    const rankingCategoryData = {
      name: rankingCategory.name,
      slug: rankingCategory.slug,
      title: rankingCategory.title,
      description: rankingCategory.description,
      rankingCategoryTypeId: rankingCategory.rankingCategoryType?.id,
      residenceLimitation: rankingCategory.residenceLimitation,
      rankingPrice: rankingCategory.rankingPrice,
      featuredImageId: rankingCategory.featuredImage?.id,
      status: rankingCategory.status,
      entityId: rankingCategory.entityId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedRankingCategory = await knex('ranking_categories')
      .insert(rankingCategoryData)
      .returning('*');

    return this.findById(insertedRankingCategory[0].id);
  }

  async findById(id: string): Promise<RankingCategory | undefined> {
    const category = await RankingCategory.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[rankingCategoryType, featuredImage, rankingCriteria]');

    if (!category) return;

    return this.resolveEntityForCategory(category);

    // return RankingCategory.query()
    //   .findById(id)
    //   .whereNull('deletedAt')
    //   .withGraphFetched('[rankingCategoryType, featuredImage, rankingCriteria]');
  }

  //   async findResidencesByCategory(
  //     rankingCategoryId: string,
  //     query: FetchResidencesByCategoryQuery
  //   ): Promise<any> {
  //     const { page, limit, sortBy, sortOrder, searchQuery } = query;

  //     const searchableColumns = ['residences.name', 'residences.description', 'residences.subtitle'];

  //     // // STEP 1: Pripremi bazni query za ID-eve
  //     // const baseQuery = Residence.query()
  //     //   .distinct('residences.id')
  //     //   .join('residence_ranking_criteria_scores as scores', 'residences.id', 'scores.residence_id')
  //     //   .join(
  //     //     'ranking_category_criteria as criteria',
  //     //     'scores.ranking_criteria_id',
  //     //     'criteria.ranking_criteria_id'
  //     //   )
  //     //   .where('criteria.ranking_category_id', rankingCategoryId)
  //     //   .whereNull('residences.deleted_at');
  //     // STEP 1: Povuci ID-eve iz residence_total_scores direktno
  // const totalScoreEntries = await this.knexService
  //   .connection('residence_total_scores')
  //   .select('residence_id')
  //   .where('ranking_category_id', rankingCategoryId);

  // const residenceIds = totalScoreEntries.map((r) => r.residence_id);

  //     applySearchFilter(baseQuery, searchQuery, searchableColumns);

  //     const idResults = await baseQuery
  //       .limit(limit)
  //       .offset((page - 1) * limit)
  //       .select('residences.id');

  //     const residenceIds = [...new Set(idResults.map((r) => r.id))];

  //     const realCount = residenceIds.length;
  //     const totalPages = Math.ceil(realCount / limit);

  //     if (!residenceIds.length) {
  //       return {
  //         data: [],
  //         pagination: {
  //           total: 0,
  //           totalPages: 0,
  //           page,
  //           limit,
  //         },
  //       };
  //     }

  //     // STEP 2: Dohvati podatke za ID-eve
  //     let dataQuery = Residence.query().whereIn('residences.id', residenceIds).withGraphFetched(`
  //     [
  //       videoTour,
  //       featuredImage,
  //       brand.[logo],
  //       keyFeatures,
  //       city,
  //       country,
  //       mainGallery,
  //       secondaryGallery,
  //       highlightedAmenities.[amenity],
  //       amenities.[icon, featuredImage],
  //       units.[featureImage],
  //       totalScores
  //     ]
  //   `);

  //     if (sortBy && sortOrder) {
  //       const allowedSort = ['residences.name', 'residences.yearBuilt', 'residences.avgPricePerUnit'];
  //       if (allowedSort.includes(sortBy)) {
  //         dataQuery = dataQuery.orderBy(sortBy, sortOrder);
  //       }
  //     } else {
  //       dataQuery = dataQuery.orderBy('residences.name', 'asc');
  //     }

  //     const data = await dataQuery;

  //     // STEP 3: Dohvati totalScore vrednosti
  //     const scores = await this.knexService
  //       .connection('residence_total_scores')
  //       .select('residence_id', 'total_score')
  //       .whereIn('residence_id', residenceIds)
  //       .andWhere('ranking_category_id', rankingCategoryId);

  //     const scoreMap = new Map(scores.map((s) => [s.residenceId, s.total_score]));

  //     // [RCS] STEP 4: Dohvati kriterijumske ocene za tu kategoriju
  //     const validRankingCriteriaIds: string[] = await this.knexService
  //       .connection('ranking_category_criteria')
  //       .where('ranking_category_id', rankingCategoryId)
  //       .pluck('ranking_criteria_id');

  //     const criteriaScores = await this.knexService
  //       .connection('residence_ranking_criteria_scores as scores')
  //       .join('ranking_criteria as rc', 'rc.id', 'scores.ranking_criteria_id')
  //       .select([
  //         'scores.residence_id',
  //         'scores.ranking_criteria_id',
  //         'scores.score',
  //         'rc.name as criteria_name',
  //         'rc.description as criteria_description',
  //         'rc.is_default as criteria_is_default',
  //       ])
  //       .whereIn('scores.residence_id', residenceIds);

  //     const scoreGrouped = new Map();

  //     for (const row of criteriaScores) {
  //       const rcId = String(row.rankingCriteriaId);
  //       const residenceId = String(row.residenceId);

  //       if (!validRankingCriteriaIds.includes(rcId)) continue;

  //       if (!scoreGrouped.has(residenceId)) {
  //         scoreGrouped.set(residenceId, []);
  //       }

  //       scoreGrouped.get(residenceId).push({
  //         rankingCriteriaId: rcId,
  //         score: row['score'],
  //         name: row.criteriaName,
  //         description: row.criteriaDescription,
  //         isDefault: row.criteriaIsDefault,
  //       });
  //     }

  //     // STEP 4: Dodaj totalScore u svaki rezultat
  //     const response = data.map((res) => ({
  //       ...res,
  //       totalScore:
  //         scoreMap.get(res.id) ??
  //         res.totalScores?.find((t) => t.rankingCategoryId === rankingCategoryId)?.totalScore ??
  //         0,
  //       position:
  //         scoreMap.get(res.id) ??
  //         res.totalScores?.find((t) => t.rankingCategoryId === rankingCategoryId)?.position ??
  //         0,
  //       rankingCriteriaScores: scoreGrouped.get(res.id) ?? [], // [RCS] dodato
  //     }));

  //     return {
  //       data: response,
  //       pagination: {
  //         total: realCount,
  //         totalPages,
  //         page,
  //         limit,
  //       },
  //     };
  //   }

  async findResidencesByCategory(
    rankingCategoryId: string,
    query: FetchResidencesByCategoryQuery
  ): Promise<any> {
    const { page, limit, sortBy, sortOrder, searchQuery, countryId } = query;

    const searchableColumns = ['residences.name', 'residences.description', 'residences.subtitle'];

    // STEP 1: Dohvati sve residence_id koje su deo kategorije
    const totalScoreEntries = await this.knexService
      .connection('residence_total_scores')
      .select('residence_id')
      .where('ranking_category_id', rankingCategoryId);

    const allResidenceIds = totalScoreEntries.map((r) => r.residenceId);
    const realCount = allResidenceIds.length;
    const totalPages = Math.ceil(realCount / limit);

    if (!realCount) {
      return {
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page,
          limit,
        },
      };
    }

    // STEP 2: Dohvati paginirane i sortirane rezidencije
    let dataQuery = Residence.query()
      .modify((qb) => {
        qb.whereNull('residences.deleted_at');
        qb.where('residences.status', ResidenceStatusEnum.ACTIVE);

        if (countryId) {
          qb.where('residences.country_id', countryId);
        }
      })
      .whereIn('residences.id', allResidenceIds).withGraphFetched(`
      [
        featuredImage,
        city,
        country,
        company
        units,
        totalScores
      ]
    `);

    applySearchFilter(dataQuery, searchQuery, searchableColumns);

    if (sortBy && sortOrder) {
      const allowedSort = ['residences.name', 'residences.yearBuilt', 'residences.avgPricePerUnit'];
      if (allowedSort.includes(sortBy)) {
        dataQuery = dataQuery.orderBy(sortBy, sortOrder);
      }
    } else {
      dataQuery = dataQuery.orderBy('residences.name', 'asc');
    }

    dataQuery.limit(limit).offset((page - 1) * limit);

    const data = await dataQuery;
    const residenceIds = data.filter((r) => r?.id).map((r) => r.id);

    // STEP 3: Dohvati totalScore vrednosti
    const scores = await this.knexService
      .connection('residence_total_scores')
      .select('residence_id', 'total_score', 'position')
      .whereIn('residence_id', residenceIds)
      .andWhere('ranking_category_id', rankingCategoryId);

    const scoreMap = new Map(
      scores.map((s) => [s.residenceId, { totalScore: s.totalScore, position: s.position }])
    );

    // STEP 4: Dohvati kriterijume koji su deo kategorije
    const validRankingCriteriaIds: string[] = await this.knexService
      .connection('ranking_category_criteria')
      .where('ranking_category_id', rankingCategoryId)
      .pluck('ranking_criteria_id');

    // STEP 5: Dohvati ocene po kriterijumu za te rezidencije
    const criteriaScores = await this.knexService
      .connection('residence_ranking_criteria_scores as scores')
      .join('ranking_criteria as rc', 'rc.id', 'scores.ranking_criteria_id')
      .select([
        'scores.residenceId',
        'scores.rankingCriteriaId',
        'scores.score',
        'rc.name as criteria_name',
        'rc.description as criteria_description',
        'rc.isDefault as criteria_is_default',
      ])
      .whereIn('scores.residence_id', residenceIds);

    const scoreGrouped = new Map();

    for (const row of criteriaScores) {
      const rcId = String(row.rankingCriteriaId);
      const residenceId = String(row.residenceId);

      if (!validRankingCriteriaIds.includes(rcId)) continue;

      if (!scoreGrouped.has(residenceId)) {
        scoreGrouped.set(residenceId, []);
      }

      scoreGrouped.get(residenceId).push({
        rankingCriteriaId: rcId,
        score: row.score,
        name: row.criteriaName,
        description: row.criteriaDescription,
        isDefault: row.criteriaIsDefault,
      });
    }

    // STEP 6: Pripremi finalni response
    const response = data.map((res) => {
      const scoreEntry = scoreMap.get(res.id);

      return {
        ...res,
        totalScore: scoreEntry?.totalScore ?? 0,
        position: scoreEntry?.position ?? 0,
        rankingCriteriaScores: scoreGrouped.get(res.id) ?? [],
      };
    });

    return {
      data: response,
      pagination: {
        total: realCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  // async findAll(
  //   query: FetchRankingCategoriesQuery
  // ): Promise<{ data: RankingCategory[]; pagination: PaginationResponse }> {
  //   const { page, limit, sortBy, sortOrder, searchQuery } = query;

  //   let rankingCategoryQuery = RankingCategory.query()
  //     .whereNull('deletedAt')
  //     .modify((qb) =>
  //       applyFilters(
  //         qb,
  //         { status: query.status, rankingCategoryTypeId: query.categoryTypeId },
  //         RankingCategory.tableName
  //       )
  //     )
  //     .withGraphFetched('[rankingCategoryType, featuredImage]');

  //   const columnsToSearch = ['ranking_categories.name', 'ranking_categories.description'];

  //   rankingCategoryQuery = applySearchFilter(rankingCategoryQuery, searchQuery, columnsToSearch);

  //   if (sortBy && sortOrder) {
  //     const columnsToSort = ['name', 'description', 'residence_limitation', 'ranking_price'];
  //     if (columnsToSort.includes(sortBy)) {
  //       rankingCategoryQuery = rankingCategoryQuery.orderBy(sortBy, sortOrder);
  //     }
  //   }

  //   const { paginatedQuery, totalCount, totalPages } = await applyPagination(
  //     rankingCategoryQuery,
  //     page,
  //     limit
  //   );

  //   return {
  //     data: paginatedQuery,
  //     pagination: {
  //       total: totalCount,
  //       totalPages,
  //       page: page,
  //       limit: limit,
  //     },
  //   };
  // }

  async findAll(
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: any[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = query;

    let rankingCategoryQuery = RankingCategory.query()
      .whereNull('deletedAt')
      .modify((qb) =>
        applyFilters(
          qb,
          { status: query.status, rankingCategoryTypeId: query.categoryTypeId },
          RankingCategory.tableName
        )
      )
      .withGraphFetched('[rankingCategoryType, featuredImage]');

    const columnsToSearch = ['ranking_categories.name', 'ranking_categories.description'];
    rankingCategoryQuery = applySearchFilter(rankingCategoryQuery, searchQuery, columnsToSearch);

    if (sortBy && sortOrder) {
      const columnsToSort = ['name', 'description', 'residence_limitation', 'ranking_price'];
      if (columnsToSort.includes(sortBy)) {
        rankingCategoryQuery = rankingCategoryQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      rankingCategoryQuery,
      page,
      limit
    );

    // -------------------------
    // Dinamički fetch entiteta
    // -------------------------
    const tableEntityMap = new Map<string, string[]>();

    for (const category of paginatedQuery) {
      const table = category.rankingCategoryType?.key;
      const entityId = category.entityId;
      if (!table || !entityId) continue;

      if (!tableEntityMap.has(table)) {
        tableEntityMap.set(table, []);
      }

      tableEntityMap.get(table)!.push(entityId);
    }

    const resolvedEntities = new Map<string, Map<string, any>>();

    for (const [table, ids] of tableEntityMap.entries()) {
      // SPECIAL CASE: cities → include country
      if (table === 'cities') {
        const cities = await this.knexService.connection('cities').whereIn('id', ids).select('*');

        const countryIds = cities.map((c) => c.countryId).filter(Boolean);

        const countries = await this.knexService
          .connection('countries')
          .whereIn('id', countryIds)
          .select('*');

        const countryMap = new Map(countries.map((c) => [c.id, c]));

        const enrichedCities = cities.map((city) => ({
          ...city,
          country: countryMap.get(city.countryId) ?? null,
        }));

        resolvedEntities.set(table, new Map(enrichedCities.map((c) => [c.id, c])));
      } else {
        // regular fetch
        const entities = await this.knexService.connection(table).whereIn('id', ids).select('*');

        resolvedEntities.set(table, new Map(entities.map((e) => [e.id, e])));
      }
    }

    const enrichedData = paginatedQuery.map((category) => {
      const table = category.rankingCategoryType?.key;
      const entity =
        table && category.entityId
          ? (resolvedEntities.get(table)?.get(category.entityId) ?? null)
          : null;

      return {
        ...category,
        entity,
      };
    });

    return {
      data: enrichedData,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  async findByName(name: string): Promise<RankingCategory | undefined> {
    return RankingCategory.query().findOne({ name }).whereNull('deletedAt');
  }

  async findBySlug(slug: string): Promise<RankingCategory | undefined> {
    // return RankingCategory.query().findOne({ slug }).whereNull('deletedAt');
    const category = await RankingCategory.query()
      .findOne({ slug })
      .whereNull('deletedAt')
      .withGraphFetched('[rankingCategoryType, featuredImage, rankingCriteria]');

    if (!category) return;

    return this.resolveEntityForCategory(category);
  }

  async update(id: string, data: Partial<RankingCategory>): Promise<RankingCategory | undefined> {
    return RankingCategory.query()
      .patchAndFetchById(id, {
        name: data.name,
        slug: data.slug,
        title: data.title,
        description: data.description,
        residenceLimitation: data.residenceLimitation,
        rankingPrice: data.rankingPrice,
        status: data.status,
        rankingCategoryTypeId: data.rankingCategoryType?.id,
        featuredImageId: data.featuredImage?.id,
        entityId: data.entityId,
        updatedAt: new Date(),
      })
      .whereNull('deletedAt');
  }

  async assignWeights(
    id: string,
    data: { rankingCriteriaId: string; weight: number }[]
  ): Promise<void> {
    const trx = await this.knexService.connection.transaction();

    try {
      const totalWeight = data.reduce((sum, c) => sum + c.weight, 0);
      if (totalWeight !== 100) {
        throw new BadRequestException('Total weight must be exactly 100%');
      }

      await trx('ranking_category_criteria').where('ranking_category_id', id).delete();

      await trx('ranking_category_criteria').insert(
        data.map((c) => ({
          id: randomUUID(),
          ranking_category_id: id,
          ranking_criteria_id: c.rankingCriteriaId,
          weight: c.weight,
        }))
      );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    await RankingCategory.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }

  private async resolveEntityForCategory(
    category: Partial<RankingCategory>
  ): Promise<RankingCategory | undefined> {
    const table = category.rankingCategoryType?.key;
    const entityId = category.entityId;

    if (!table || !entityId) {
      return category as RankingCategory;
    }

    if (table === 'cities') {
      const city = await this.knexService.connection('cities').where('id', entityId).first();

      if (!city) return category as RankingCategory;

      const country = await this.knexService
        .connection('countries')
        .where('id', city.countryId)
        .first();

      return {
        ...category,
        entity: {
          ...city,
          country: country ?? null,
        },
      } as RankingCategory;
    }

    const entity = await this.knexService.connection(table).where('id', entityId).first();

    return {
      ...category,
      entity: entity ?? null,
    } as RankingCategory;
  }
}
