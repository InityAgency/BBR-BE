import { BaseMediaRequest } from 'src/shared/ui/request/base-media.request';
import { BrandStatus } from '../../domain/brand-status.enum';
import { MediaFileRequest } from 'src/shared/ui/request/media-file.request';

export class CreateBrandCommand extends BaseMediaRequest {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly brandTypeId: string,
    public readonly logoId: string,
    public readonly status: BrandStatus,
    public readonly registeredAt: Date,
    public readonly uploads?: MediaFileRequest[],
    public readonly deleted?: string[]
  ) {
    super();
  }
}
