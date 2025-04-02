import { BrandResponse } from 'src/modules/brand/ui/response/brand-response';
import { Lifestyle } from '../../domain/lifestyle.entity';
import { LifestyleResponse } from '../response/lifestyle.response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class LifestyleMapper {
  static toResponse(lifestyle: Lifestyle): LifestyleResponse {
    return new LifestyleResponse(
      lifestyle.id,
      lifestyle.name,
      lifestyle.createdAt,
      lifestyle.updatedAt,
      lifestyle.order
    );
  }
}
