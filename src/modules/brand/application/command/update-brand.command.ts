import { BrandStatus } from '../../domain/brand-status.enum';

export class UpdateBrandCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: string,
    public readonly status: BrandStatus,
    public readonly registeredAt: Date
  ) {}
}
