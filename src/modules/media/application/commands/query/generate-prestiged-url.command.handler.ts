import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/modules/media/infrastructure/s3/s3.service';
import { GetPresignedUrlQuery } from '../get-presigned-url.query';

@Injectable()
export class GeneratePrestigedUrlCommandQuery {
  constructor(private readonly s3Service: S3Service) {}

  async handler(
    query: GetPresignedUrlQuery
  ): Promise<Array<{ presignedUrl: string; fileKey: string; fileType: string }>> {
    const results: Array<{ presignedUrl: string; fileKey: string; fileType: string }> = [];

    for (const fileReq of query.files) {
      const count = fileReq.count || 1;
      for (let i = 0; i < count; i++) {
        const result = await this.s3Service.getPresignedUrl(fileReq.fileType, query.entity);
        results.push({ presignedUrl: result.url, fileKey: result.key, fileType: fileReq.fileType });
      }
    }

    // const result = await this.s3Service.getPresignedUrl(query.fileType);
    return results;
  }
}
