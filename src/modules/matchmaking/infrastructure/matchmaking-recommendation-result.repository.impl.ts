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

  async upsert(data: any) {
    // Nadji po sessionId + userId i uradi update ili insert
    await this.model.findOneAndUpdate(
      { sessionId: data.sessionId, userId: data.userId },
      { $set: data },
      { upsert: true, new: true }
    );
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
