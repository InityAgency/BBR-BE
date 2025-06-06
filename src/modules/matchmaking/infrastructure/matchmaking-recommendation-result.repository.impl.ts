import { Injectable } from '@nestjs/common';
import { MatchmakingRecommendationResult } from '../domain/schema/matchmaking-recommendation-results.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MatchmakingRecommendationResultRepositoryImpl {
  constructor(
    @InjectModel(MatchmakingRecommendationResult.name)
    private readonly model: Model<MatchmakingRecommendationResult>
  ) {}

  async create(recommendationResult: Partial<MatchmakingRecommendationResult>): Promise<any> {
    return this.model.create(recommendationResult);
  }

  async findBySession(sessionId: string) {
    this.model.find({ sessionId }).lean().exec();
  }

  async findLastBySession(sessionId: string) {
    return this.model
      .findOne({ sessionId, aiCriteria: { $exists: true } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
