import { BrandResponse } from 'src/modules/brand/ui/response/brand-response';

export class BrandTypeResponseWithBrands {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date,
    public readonly brands?: BrandResponse[]
  ) {}
}
