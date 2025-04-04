import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { UpdateResidenceStatusCommand } from '../commands/update-residence-status.command';

@Injectable()
export class UpdateResidenceStatusCommandHandler {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(command: UpdateResidenceStatusCommand): Promise<void> {
    const residence = await this.residenceRepository.findById(command.id);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    const updated = await this.residenceRepository.update(command.id, {
      status: command.status,
    });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update residence status');
    }
  }
}
