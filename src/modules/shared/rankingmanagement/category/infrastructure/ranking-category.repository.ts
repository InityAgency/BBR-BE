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

@Injectable()
export class RankingCategoryRepositoryImpl implements IRankingCategoryRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(rankingCategory: Partial<RankingCategory>): Promise<RankingCategory | undefined> {
    const rankingCategoryData = {
      name: rankingCategory.name,
      slug: rankingCategory.slug,
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
    return RankingCategory.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[rankingCategoryType, featuredImage, rankingCriteria]');
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
    return RankingCategory.query().findOne({ slug }).whereNull('deletedAt');
  }

  async update(id: string, data: Partial<RankingCategory>): Promise<RankingCategory | undefined> {
    return RankingCategory.query().patchAndFetchById(id, data).whereNull('deletedAt');
  }

  async assignWeights(
    id: string,
    data: { rankingCriteriaId: string; weight: number; isDefault: boolean }[]
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
          is_default: c.isDefault,
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
}
