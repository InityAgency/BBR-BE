import { RankingCriteria } from '../../domain/ranking-criteria.entity';
import { IRankingCriteriaRepository } from '../../domain/ranking-criteria.repository.interface';
import { FetchAllRankingCriteriaForResidenceQuery } from '../commands/fetch-ranking-criteria-for-residence.query';

export class FindAllRankingCriteriaResidenceCategoryQueryHandler {
  constructor(private readonly rankingCriteriaRepository: IRankingCriteriaRepository) {}

  async handle(command: FetchAllRankingCriteriaForResidenceQuery): Promise<RankingCriteria[]> {
    const { residenceId, rankingCategoryId } = command;

    const rankingCriteria = await this.rankingCriteriaRepository.findAllByResidenceAndCategory(
      residenceId,
      rankingCategoryId
    );

    return rankingCriteria;
  }
}
