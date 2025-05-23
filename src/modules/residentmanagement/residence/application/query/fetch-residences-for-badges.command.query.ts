import { Injectable } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { FetchResidencesQuery } from '../commands/fetch-residences.query';

@Injectable()
export class fetchResidencesForBadgesCommandQuery {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(command: FetchResidencesQuery) {}
}
