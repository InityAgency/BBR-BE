import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingScoreRepository } from 'src/modules/residentmanagement/ranking_score/domain/residence-ranking-score.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { AssignResidencesToRankingCategoryCommand } from '../command/assign-residences-to-ranking-category.command';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';

@Injectable()
export class AssignResidencesToRankingCategoryCommandHandler {
  constructor(
    private readonly knexService: KnexService,
    private readonly scoreRepository: IRankingScoreRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository
  ) {}

  async handle(command: AssignResidencesToRankingCategoryCommand): Promise<void> {
    const { rankingCategoryId, residenceIds } = command;

    const rankingCategoryExist = await this.rankingCategoryRepository.findById(rankingCategoryId);
    if (!rankingCategoryExist) {
      throw new NotFoundException('Ranking category not found');
    }

    await this.knexService.connection.transaction(async (trx) => {
      for (const residenceId of residenceIds) {
        const exists = await trx('residence_ranking_score')
          .where({ residence_id: residenceId })
          .first();

        // Dodeli kategoriju (ako koristiš neku pivot tabelu, insertuješ je ovde)
        // Ako već koristiš samo score tabelu, možeš preskočiti

        // Ako već postoje ocene za tu rezidenciju → izračunaj skor u toj kategoriji
        if (exists) {
          await this.scoreRepository.updateTotalScore(residenceId, rankingCategoryId);
        }
      }

      // Na kraju, izračunaj pozicije unutar te kategorije
      await this.scoreRepository.updateRankingPositionsForCategory(rankingCategoryId);
    });
  }
}
