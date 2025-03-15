import { StartupSnapshot } from 'v8';
import { BrandStatus } from '../../domain/brand-status.enum';
import { publicDecrypt } from 'crypto';

export class CreateBrandCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly type: string,
    public readonly status: BrandStatus,
    public readonly registeredAt: Date
  ) {}
}
