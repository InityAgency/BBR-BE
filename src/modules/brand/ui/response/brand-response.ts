import { BrandType } from 'src/modules/brand_types/domain/brand-type.entity';
import { Media } from 'src/modules/media/domain/media.entity';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class BrandResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly status: string,
    public readonly registeredAt: Date,
    public readonly brandTypeId: string,
    public readonly brandType?: BrandType,
    public readonly logo?: MediaResponse | null
  ) {}
}
