import { Injectable } from '@nestjs/common';
import { Media } from '../../../domain/media.entity';
import { CreateMediaCommand } from '../create-media.command';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';

@Injectable()
export class CreateMediaCommandHandler {
  constructor(private readonly mediaRepository: IMediaRepository) {}

  async handler(command: CreateMediaCommand): Promise<Media> {
    return await this.mediaRepository.create(command);
  }
}
