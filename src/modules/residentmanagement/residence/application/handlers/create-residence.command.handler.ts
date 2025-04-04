import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateResidenceCommand } from '../commands/create-residence.command';
import { Residence } from '../../domain/residence.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';

@Injectable()
export class CreateResidenceCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly knexService: KnexService
  ) {}

  async handle(command: CreateResidenceCommand): Promise<Residence> {
    const residence = await this.residenceRepository.create(command);

    if (!residence) {
      throw new InternalServerErrorException('Residence not created');
    }

    const created = await this.residenceRepository.findById(residence.id);

    if (!created) {
      throw new InternalServerErrorException('Residence not created');
    }

    return created;
  }
}
