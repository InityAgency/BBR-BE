import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class LifestyleResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly imageId?: string,
    public readonly image?: MediaResponse | null,
    public readonly order?: number
  ) {}
}
