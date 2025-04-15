import { Injectable } from '@nestjs/common';
import { IRankingScoreRepository } from '../domain/residence-ranking-score.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';

@Injectable()
export class ResidenceRankingScoreRepositoryImpl implements IRankingScoreRepository {
  constructor(private readonly knexService: KnexService) {}

  async score(
    residenceId: string,
    rankingCategoryId: string,
    scores: { rankingCriteriaId: string; score: number }[]
  ): Promise<void> {
    await this.knexService.connection.transaction(async (trx) => {
      await trx('residence_ranking_criteria_scores')
        .where({ residence_id: residenceId, ranking_category_id: rankingCategoryId })
        .delete();

      const insertData = scores.map((s) => ({
        residence_id: residenceId,
        ranking_category_id: rankingCategoryId,
        ranking_criteria_id: s.rankingCriteriaId,
        score: s.score,
      }));

      await trx('residence_ranking_criteria_scores').insert(insertData);
    });
  }

  async updateTotalScore(residenceId: string, rankingCategoryId: string): Promise<void> {
    const scores = await this.knexService
      .connection('residence_ranking_criteria_scores as scores')
      .join('ranking_category_criteria as weights', function () {
        this.on('scores.ranking_criteria_id', '=', 'weights.ranking_criteria_id').andOn(
          'scores.ranking_category_id',
          '=',
          'weights.ranking_category_id'
        );
      })
      .where('scores.residence_id', residenceId)
      .andWhere('scores.ranking_category_id', rankingCategoryId)
      .select('scores.score', 'weights.weight');

    if (!scores.length) return;

    const totalScore = scores.reduce((acc, row) => acc + row.score * (row.weight / 100), 0);

    await this.knexService
      .connection('residence_total_scores')
      .insert({
        residence_id: residenceId,
        ranking_category_id: rankingCategoryId,
        total_score: Math.round(totalScore * 100) / 100,
      })
      .onConflict(['residence_id', 'ranking_category_id'])
      .merge({
        total_score: Math.round(totalScore * 100) / 100,
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
    const categoryIds = await this.knexService
      .connection('residence_ranking_score')
      .distinct('ranking_category_id')
      .where({ residence_id: residenceId })
      .pluck('ranking_category_id');

    for (const categoryId of categoryIds) {
      await this.updateTotalScore(residenceId, categoryId);
      await this.updateRankingPositionsForCategory(categoryId);
    }
  }
}
