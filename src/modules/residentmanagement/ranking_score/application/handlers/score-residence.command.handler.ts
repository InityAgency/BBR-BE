import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingScoreRepository } from '../../domain/residence-ranking-score.repository.interface';
import { ScoreResidenceCommand } from '../commands/score-residence.command';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';
import { IRankingCriteriaRepository } from 'src/modules/shared/rankingmanagement/criteria/domain/ranking-criteria.repository.interface';

@Injectable()
export class ScoreResidenceCommandHandler {
  constructor(
    private readonly rankingScoreRepository: IRankingScoreRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository,
    private readonly rankingCriteriaRepository: IRankingCriteriaRepository
  ) {}

  // async handle(command: ScoreResidenceCommand): Promise<void> {
  //   const { residenceId, rankingCategoryId, scores } = command;

  //   const isResidenceExists = await this.residenceRepository.findById(residenceId);

  //   if (!isResidenceExists) {
  //     throw new NotFoundException('Residence not found');
  //   }

  //   const isRankingCategoryExists =
  //     await this.rankingCategoryRepository.findById(rankingCategoryId);

  //   if (!isRankingCategoryExists) {
  //     throw new NotFoundException('Ranking category not found');
  //   }

  //   const criteriaIds = scores.map((score) => score.rankingCriteriaId);

  //   const existingCriteria = await this.rankingCriteriaRepository.findByIds(criteriaIds);

  //   if (existingCriteria.length !== criteriaIds.length) {
  //     throw new NotFoundException('Some ranking criteria not found');
  //   }

  //   // await this.rankingScoreRepository.score(residenceId, rankingCategoryId, scores);
  //   // await this.rankingScoreRepository.updateTotalScore(residenceId, rankingCategoryId);
  //   // await this.rankingScoreRepository.updateRankingPositionsForCategory(rankingCategoryId);
  //   await this.rankingScoreRepository.score(residenceId, rankingCategoryId, scores);
  //   await this.rankingScoreRepository.updateAllTotalScoresForResidence(residenceId);
  // }

  async handle(command: ScoreResidenceCommand): Promise<void> {
    const { residenceId, scores } = command;

    const isResidenceExists = await this.residenceRepository.findById(residenceId);
    if (!isResidenceExists) throw new NotFoundException('Residence not found');

    const criteriaIds = scores.map((score) => score.rankingCriteriaId);
    const existingCriteria = await this.rankingCriteriaRepository.findByIds(criteriaIds);

    if (existingCriteria.length !== criteriaIds.length) {
      throw new NotFoundException('Some ranking criteria not found');
    }

    await this.rankingScoreRepository.score(residenceId, scores);
    await this.rankingScoreRepository.updateAllTotalScoresForResidence(residenceId);
  }
}
