import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS environment variables!');
    }

    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') ?? '';
    const config: S3ClientConfig = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    this.s3Client = new S3Client(config);
  }

  async getPresignedUrl(fileType: string): Promise<{ url: string; key: string }> {
    const key = `uploads/${uuidv4()}`;
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: fileType });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
