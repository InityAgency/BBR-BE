import { Media } from '../domain/media.entity';
import { IMediaRepository } from '../domain/media.repository.interface';
import { S3Service } from './s3/s3.service';
import { v4 as uuidv4 } from 'uuid';

export class MediaRepository implements IMediaRepository {
  constructor(private readonly s3Service: S3Service) {}

  async create(data: any): Promise<any> {
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
      await this.s3Service.deleteFile(existing.fileName);
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

  async delete(id: string): Promise<any> {
    const media = await Media.query().findById(id);
    if (media) {
      await this.s3Service.deleteFile(media.fileName);
    }
    return await Media.query().deleteById(id);
  }
}
