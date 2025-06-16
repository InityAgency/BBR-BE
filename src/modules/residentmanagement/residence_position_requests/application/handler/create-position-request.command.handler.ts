import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { ResidencePositionRequest } from '../../domain/residence-position-requests.entity';
import { IResidencePositionRequestsRepository } from '../../domain/residence-position-requests.repository.interface';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { CreatePositionRequestCommand } from '../command/create-position-request.command';

@Injectable()
export class CreatePositionRequestCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository,
    private readonly positionRequestRepository: IResidencePositionRequestsRepository
  ) {}

  async handle(command: CreatePositionRequestCommand): Promise<ResidencePositionRequest> {
    const residence = await this.residenceRepository.findById(command.residenceId);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    const rankingCategory = await this.rankingCategoryRepository.findById(
      command.rankingCategoryId
    );

    if (!rankingCategory) {
      throw new NotFoundException('Ranking category not found');
    }

    const positionRequest = {
      residenceId: residence.id,
      rankingCategoryId: rankingCategory.id,
      requestedBy: command.requestedBy,
    };

    const created = await this.positionRequestRepository.create(positionRequest);

    if (!created) {
      throw new NotFoundException('Position request not created');
    }

    return created;
  }
}
