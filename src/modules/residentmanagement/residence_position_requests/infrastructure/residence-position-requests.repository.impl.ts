import { ResidencePositionRequest } from '../domain/residence-position-requests.entity';
import { IResidencePositionRequestsRepository } from '../domain/residence-position-requests.repository.interface';

export class ResidencePositionRequestsRepositoryImpl
  implements IResidencePositionRequestsRepository
{
  constructor() {}

  async findById(id: string): Promise<ResidencePositionRequest | undefined> {
    return ResidencePositionRequest.query().findById(id);
  }

  async create(
    residencePositionRequest: Partial<ResidencePositionRequest>
  ): Promise<ResidencePositionRequest | undefined> {
    return ResidencePositionRequest.query().insertAndFetch(residencePositionRequest).returning('*');
  }
}
