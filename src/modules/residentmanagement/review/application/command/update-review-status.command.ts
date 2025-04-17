import { ReviewStatusEnum } from '../../domain/review-status.enum';

export class UpdateReviewStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: ReviewStatusEnum
  ) {}
}
