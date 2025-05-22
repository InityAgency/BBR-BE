import { Injectable } from '@nestjs/common';
import { IRankingScoreRepository } from '../domain/residence-ranking-score.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';

@Injectable()
export class ResidenceRankingScoreRepositoryImpl implements IRankingScoreRepository {
  constructor(private readonly knexService: KnexService) {}

  async score(
    residenceId: string,
    scores: { rankingCriteriaId: string; score: number }[]
  ): Promise<void> {
    await this.knexService.connection.transaction(async (trx) => {
      // Brišemo prethodne ocene samo za te kriterijume
      const criteriaIds = scores.map((s) => s.rankingCriteriaId);

      await trx('residence_ranking_criteria_scores')
        .where('residence_id', residenceId)
        .whereIn('ranking_criteria_id', criteriaIds)
        .delete();

      const insertData = scores.map((s) => ({
        residence_id: residenceId,
        ranking_criteria_id: s.rankingCriteriaId,
        score: s.score,
      }));

      await trx('residence_ranking_criteria_scores').insert(insertData);
    });
  }

  async getCriteriaWithCategoriesForResidence(residenceId: string) {
    const knex = this.knexService.connection;

    const rows = await knex('residence_ranking_criteria_scores as scores')
      .select([
        'rc.id as criteriaId',
        'rc.name as criteriaName',
        'rc.description',
        'rc.is_default',
        'scores.score',
        'cat.id as categoryId',
        'cat.name as categoryName',
        'rcc.weight',
        'rts.id as rtsId', // 👈 da znamo da li je veza validna
      ])
      .join('ranking_criteria as rc', 'rc.id', 'scores.ranking_criteria_id')
      .leftJoin('ranking_category_criteria as rcc', 'rcc.ranking_criteria_id', 'rc.id')
      .leftJoin('ranking_categories as cat', 'cat.id', 'rcc.ranking_category_id')
      .leftJoin('residence_total_scores as rts', function () {
        this.on('rts.residence_id', '=', 'scores.residence_id').andOn(
          'rts.ranking_category_id',
          '=',
          'rcc.ranking_category_id'
        );
      })
      .where('scores.residence_id', residenceId)
      .orderBy(['rc.name', 'cat.name']);

    const grouped = new Map();

    for (const row of rows) {
      if (!grouped.has(row.criteriaId)) {
        grouped.set(row.criteriaId, {
          id: row.criteriaId,
          name: row.criteriaName,
          description: row.description,
          isDefault: row.isDefault,
          score: row.score,
          rankingCategories: [],
        });
      }

      if (row.categoryId && row.rtsId) {
        // 👈 samo ako je rezidencija deo te kategorije
        grouped.get(row.criteriaId).rankingCategories.push({
          id: row.categoryId,
          name: row.categoryName,
          weight: row.weight,
        });
      }
    }

    return Array.from(grouped.values());
  }

  async updateTotalScore(residenceId: string, rankingCategoryId: string): Promise<void> {
    const knex = this.knexService.connection;

    // 1) let Postgres do the math:
    const subquery = knex('residence_ranking_criteria_scores')
      .distinctOn('ranking_criteria_id')
      .select('ranking_criteria_id', 'score')
      .where('residence_id', residenceId)
      .orderBy([
        { column: 'ranking_criteria_id', order: 'asc' },
        { column: 'created_at', order: 'desc' },
      ]);

    const result = await knex
      .from(subquery.as('s'))
      .join('ranking_category_criteria as w', 's.ranking_criteria_id', 'w.ranking_criteria_id')
      .where('w.ranking_category_id', rankingCategoryId)
      .sum<{ totalScore: string }>({
        totalScore: knex.raw('s.score * w.weight / 100.0'),
      })
      .first();

    const totalScore = result?.totalScore;

    if (totalScore == null) return; // no scores

    // 2) round and upsert
    const rounded = Math.round(Number(totalScore) * 100) / 100;

    await knex('residence_total_scores')
      .insert({
        residence_id: residenceId,
        ranking_category_id: rankingCategoryId,
        total_score: rounded,
      })
      .onConflict(['residence_id', 'ranking_category_id'])
      .merge({
        total_score: rounded,
        updated_at: new Date(),
      });
  }

  async updateRankingPositionsForCategory(rankingCategoryId: string): Promise<void> {
    const rawQuery = `
      WITH ranked AS (
        SELECT
          id,
          RANK() OVER (PARTITION BY ranking_category_id ORDER BY total_score DESC) AS position
        FROM residence_total_scores
        WHERE ranking_category_id = ?
      )
      UPDATE residence_total_scores
      SET position = ranked.position
      FROM ranked
      WHERE residence_total_scores.id = ranked.id;
    `;

    await this.knexService.connection.raw(rawQuery, [rankingCategoryId]);
  }

  async updateAllTotalScoresForResidence(residenceId: string): Promise<void> {
    const criteriaIds = await this.knexService
      .connection('residence_ranking_criteria_scores')
      .where({ residence_id: residenceId })
      .pluck('ranking_criteria_id');

    if (!criteriaIds.length) return;

    const categoryIds = await this.knexService
      .connection('ranking_category_criteria')
      .distinct('ranking_category_id')
      .whereIn('ranking_criteria_id', criteriaIds)
      .pluck('ranking_category_id');

    for (const categoryId of categoryIds) {
      await this.updateTotalScore(residenceId, categoryId);
      await this.updateRankingPositionsForCategory(categoryId);
    }
  }

  async removeResidenceScoreFromCategory(
    residenceId: string,
    rankingCategoryId: string
  ): Promise<void> {
    await this.knexService
      .connection('residence_total_scores')
      .where({ residence_id: residenceId, ranking_category_id: rankingCategoryId })
      .delete();
  }
}
