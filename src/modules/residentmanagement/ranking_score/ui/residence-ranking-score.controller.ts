import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScoreResidenceCommand } from '../application/commands/score-residence.command';
import { ScoreResidenceCommandHandler } from '../application/handlers/score-residence.command.handler';
import { ScoreResidenceRequest } from './request/score-residence.request';
import { FetchScoresResidenceCommandQuery } from '../application/query/fetch-scores-residence.command.query';

@ApiTags('Residence Ranking Score')
@Controller('residences/:id/scores')
export class ResidenceRankingScoreController {
  constructor(
    private readonly scoreResidenceCommandHandler: ScoreResidenceCommandHandler,
    private readonly fetchScoresResidenceCommandQuery: FetchScoresResidenceCommandQuery
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Score residence' })
  async scoreResidence(@Param('id') residenceId: string, @Body() request: ScoreResidenceRequest) {
    const command = new ScoreResidenceCommand(residenceId, request.scores);

    await this.scoreResidenceCommandHandler.handle(command);
  }

  @Get('')
  @ApiOperation({ summary: 'Get residence scores' })
  async getResidenceScores(@Param('id') residenceId: string) {
    return await this.fetchScoresResidenceCommandQuery.handle(residenceId);
  }
}
