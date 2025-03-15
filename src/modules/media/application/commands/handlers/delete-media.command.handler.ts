import { Injectable } from '@nestjs/common';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { DeleteMediaCommand } from '../delete-media.command';

@Injectable()
export class DeleteMediaCommandHandler {
  constructor(private readonly mediaRepository: IMediaRepository) {}

  async handler(command: DeleteMediaCommand): Promise<number> {
    return await this.mediaRepository.delete(command.id);
  }
}
