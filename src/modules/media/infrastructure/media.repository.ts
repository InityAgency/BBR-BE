import { Injectable } from '@nestjs/common';
import { IMediaRepository } from '../domain/media.repository.interface';
import { Media } from '../domain/media.entity';
import { MediaUploadStatus } from '../domain/media-upload-status.enum';

@Injectable()
export class MediaRepositoryImpl implements IMediaRepository {
  async create(media: Media): Promise<Media> {
    return await Media.query().insert(media);
  }

  async findById(id: string): Promise<Media | undefined> {
    return await Media.query().findById(id);
  }

  async findActiveById(id: string): Promise<Media | null> {
    const media = await Media.query().where('id', id).whereNull('deletedAt').first();
    return media || null;
  }

  async updateExternalId(id: string, externalId: string): Promise<void> {
    await Media.query().where('id', id).whereNull('deletedAt').update({
      externalId,
      updatedAt: new Date(),
    });
  }

  async updateUploadStatus(id: string, uploadStatus: MediaUploadStatus): Promise<void> {
    await Media.query().where('id', id).whereNull('deletedAt').update({
      uploadStatus,
      updatedAt: new Date(),
    });
  }

  async fetchUnusedMediaCreatedAfter(date: Date): Promise<Media[]> {
    return await Media.query()
      .leftJoinRelated('[brands]')
      .whereNull('media.deletedAt')
      .andWhere('media.createdAt', '<', date)
      .whereNull('brands.mediaId') //TODO: syncat naziv sa nazivom kolone
      .select('media.*');
  }

  async deleteByIds(ids: string[]): Promise<void> {
    await Media.query().whereIn('id', ids).update({
      deletedAt: new Date(),
    });
  }
}
