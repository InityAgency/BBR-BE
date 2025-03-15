import { Injectable } from '@nestjs/common';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { Media } from '../../../domain/media.entity';
import { UpdateMediaCommand } from '../update-media.command';

@Injectable()
export class UpdateMediaCommandHandler {
  constructor(private readonly mediaRepository: IMediaRepository) {}

  async handler(command: UpdateMediaCommand): Promise<Media> {
    return await this.mediaRepository.update(command.id, command);
  }
}
