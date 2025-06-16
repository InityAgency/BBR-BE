import { CreatePositionRequestCommand } from '../../application/command/create-position-request.command';
import { CreatePositionRequestRequest } from '../request/create-position-request.request';

export class PositionRequestMapper {
  static toResponse(positionRequest) {
    return {
      id: positionRequest.id,
      residenceId: positionRequest.residenceId,
      unitId: positionRequest.unitId,
      position: positionRequest.position,
      status: positionRequest.status,
      createdAt: positionRequest.createdAt,
      updatedAt: positionRequest.updatedAt,
    };
  }

  static toCreateCommand(
    positionRequest: CreatePositionRequestRequest
  ): CreatePositionRequestCommand {
    return {
      residenceId: positionRequest.residenceId,
      rankingCategoryId: positionRequest.rankingCategoryId,
      requestedBy: positionRequest.requestedBy,
    };
  }
}
