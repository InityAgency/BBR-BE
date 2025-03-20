import { Injectable } from '@nestjs/common';
import { EntityMedia } from '../domain/entity-media.entity';

@Injectable()
export class EntityMediaRepository {
  async getEntityMedia(entityId: number, entityType: string, mediaType: string) {
    return await EntityMedia.query().where({ entityId, entityType, mediaType }).first(); // Get only one because it's One-to-One
  }
}
