import { Injectable } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { FetchResidencesQuery } from '../commands/fetch-residences.query';

@Injectable()
export class fetchResidencesForBadgesCommandQuery {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  //   TODO TREBA DA SE NAPRAVI RUTA DA VRACA SAMO OSNOVNE STVARI ZA totalScores bez galerija, amenity. key features i ostalog, najbolje napraviti mozda novi findAll za tu svrhu i
  //  TODO I to iskljucivo samo rezidencije koje su za developera koji salje request nista manje nista vise!
  async handle(query: FetchResidencesQuery) {
    const result = await this.residenceRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
