export abstract class IRankingScoreRepository {
  abstract score(
    residenceId: string,
    rankingCategoryId: string,
    scores: {
      rankingCriteriaId: string;
      score: number;
    }[]
  ): Promise<void>;

  abstract updateTotalScore(residenceId: string, rankingCategoryId: string): Promise<void>;
  abstract updateRankingPositionsForCategory(rankingCategoryId: string): Promise<void>;
  abstract updateAllTotalScoresForResidence(residenceId: string): Promise<void>;
}
