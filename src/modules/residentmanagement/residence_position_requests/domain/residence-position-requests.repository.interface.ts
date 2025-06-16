import { ResidencePositionRequest } from './residence-position-requests.entity';

export abstract class IResidencePositionRequestsRepository {
  abstract create(
    residencePositionRequest: Partial<ResidencePositionRequest>
  ): Promise<ResidencePositionRequest | undefined>;

  abstract findById(id: string): Promise<ResidencePositionRequest | undefined>;
}
