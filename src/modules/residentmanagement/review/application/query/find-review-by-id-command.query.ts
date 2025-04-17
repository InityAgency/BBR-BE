import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '../../domain/review.entity';
import { IReviewRepository } from '../../domain/ireview.repository.interface';

@Injectable()
export class FindReviewByIdCommandQuery {
  constructor(
    private readonly reviewRepository: IReviewRepository
  ) {}

  async handle(id: string): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }
}
