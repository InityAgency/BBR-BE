import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/modules/media/infrastructure/s3/s3.service';
import { GetPresignedUrlQuery } from '../get-presigned-url.query';

@Injectable()
export class GeneratePrestigedUrlCommandQuery {
  constructor(private readonly s3Service: S3Service) {}

  async handler(query: GetPresignedUrlQuery): Promise<{ presignedUrl: string; fileKey: string }> {
    const result = await this.s3Service.getPresignedUrl(query.fileType);
    return { presignedUrl: result.url, fileKey: result.key };
  }
}
