import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScoreResidenceCommand } from '../application/commands/score-residence.command';
import { ScoreResidenceCommandHandler } from '../application/handlers/score-residence.command.handler';
import { ScoreResidenceRequest } from './request/score-residence.request';

@ApiTags('Residence Ranking Score')
@Controller('residences/:id/scores')
export class ResidenceRankingScoreController {
  constructor(private readonly scoreResidenceCommandHandler: ScoreResidenceCommandHandler) {}

  @Post(':rankingCategoryId')
  @ApiOperation({ summary: 'Score residence' })
  async scoreResidence(
    @Param('id') residenceId: string,
    @Param('rankingCategoryId') categoryId: string,
    @Body() request: ScoreResidenceRequest
  ) {
    const command = new ScoreResidenceCommand(residenceId, categoryId, request.scores);

    await this.scoreResidenceCommandHandler.handle(command);
  }
}
