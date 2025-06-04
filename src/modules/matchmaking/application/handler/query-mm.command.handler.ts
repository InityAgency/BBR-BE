import { Injectable } from '@nestjs/common';
import { IMatchmakingRecommendationResultRepository } from '../../domain/matchmaking-recommendation-result.repository.interface';
import { AiMatchmakingService } from '../services/matchmaking-ai.service';
import { IResidenceRepository } from '../../domain/residence.repository.interface';

@Injectable()
export class QueryMMCommandHandler {
  constructor(
    private readonly matchmakingRecommendationResultRepository: IMatchmakingRecommendationResultRepository,
    private readonly aiMatchmakingService: AiMatchmakingService,
    private readonly residenceRepository: IResidenceRepository
  ) {}

  async handle(command: any) {
    const previousRecommendation =
      await this.matchmakingRecommendationResultRepository.findLastBySession(command.sessionId);

    const previousCriteria = previousRecommendation?.aiCriteria || {};
    const userMessage = command.userMessage;

    const { friendlyResponse, criteria: baseCriteria } =
      await this.aiMatchmakingService.progressiveFillCombined(previousCriteria, userMessage);

    console.log(friendlyResponse, baseCriteria);

    // const residences = await this.residenceRepository.findByCriteria(criteria);
    let results = await this.residenceRepository.findByCriteria(baseCriteria);

    // 1. Najstroži upit (sve što korisnik traži)
    if (results.length > 0)
      return { friendlyResponse, residences: results, relaxed: false, relaxedFields: [] };

    const relaxOrder: string[] = [
      'budgetEndRange',
      'budgetStartRange',
      'highlightedAmenities',
      'amenities',
      'keyFeatures',
      'petFriendly',
    ] as string[];
    // 2. Fallback — uklanja jedan po jedan kriterijum iz relaxOrder liste
    let relaxedFields: any[] = [];
    let criteria: Record<string, any> = { ...baseCriteria };

    for (const field of relaxOrder) {
      if (field in criteria) {
        delete (criteria as any)[field];
        relaxedFields.push(field);
        results = await this.residenceRepository.findByCriteria(criteria);
        if (results.length > 0) {
          return { friendlyResponse, residences: results, relaxed: true, relaxedFields };
        }
      }
    }

    // 3. Ako i dalje nema rezultata, vrati bez ijednog filtera
    const residences = await this.residenceRepository.findByCriteria({});

    return {
      friendlyResponse,
      residences,
    };
    // updatedCriteria koristiš direktno za filtriranje u bazi (Postgres/Knex/Objection)
  }
}
