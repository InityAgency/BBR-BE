import { EntityMedia } from '../domain/entity-media.entity';
import { Media } from '../domain/media.entity';
import { IMediaRepository } from '../domain/media.repository.interface';
import { S3Service } from './s3/s3.service';
import { v4 as uuidv4 } from 'uuid';

export class MediaRepository implements IMediaRepository {
  constructor(private readonly s3Service: S3Service) {}

  async create(data: any): Promise<any> {
    if (Array.isArray(data)) {
      // **Bulk insert for multiple media**
      const mediaRecords = data.map((file) => ({
        id: uuidv4(),
        fileName: file.fileName,
        fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.fileName}`,
        mimeType: file.fileType,
        bucketName: process.env.AWS_S3_BUCKET,
        createdAt: new Date(),
        uploadedBy: file.uploadedBy,
      }));

      return await Media.query().insert(mediaRecords).returning('*'); // ✅ Bulk insert
    }

    // Single file upload
    const { fileName, fileType, uploadedBy } = data;
    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const media = await Media.query().insert({
      id: uuidv4(),
      fileName: fileName,
      fileUrl: fileUrl,
      mimeType: fileType,
      bucketName: process.env.AWS_S3_BUCKET,
      createdAt: new Date(),
      uploadedBy: uploadedBy,
    });
    return media;
  }

  async update(id: string, data: any): Promise<any> {
    const { fileName, fileType, uploadedBy } = data;

    const existing = await Media.query().findById(id);

    if (existing) {
      await this.s3Service.deleteFiles([existing.fileName]);
    }

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    const updated = await Media.query().patchAndFetchById(id, {
      fileName: fileName,
      fileUrl,
      mimeType: fileType,
      uploadedBy,
    });
    return updated;
  }

  async delete(mediaIds: string[]): Promise<any> {
    if (!mediaIds.length) return;

    // Get media keys before deleting from DB
    const mediaKeys = await Media.query().select('key').whereIn('id', mediaIds);

    if (mediaKeys.length) {
      // Delete from S3
      await this.s3Service.deleteFiles(mediaKeys.map((m) => m.fileName));
    }

    // Remove from DB
    await Media.query().delete().whereIn('id', mediaIds);

    // Always remove media references from pivot table
    return await EntityMedia.query().delete().whereIn('mediaId', mediaIds);
  }

  async moveFileToDestination(tempFileKey: string, destinationFolder: string) {
    return await this.s3Service.moveFileToDestination(tempFileKey, destinationFolder);
  }
}
