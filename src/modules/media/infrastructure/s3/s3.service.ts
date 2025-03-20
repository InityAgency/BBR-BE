import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig,
  DeleteObjectsCommand,
  CopyObjectCommand,
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

  async getPresignedUrl(fileType: string, entity: string): Promise<{ url: string; key: string }> {
    const timestamp = Date.now();
    const shortUUID = uuidv4().split('-')[0];

    const key = `temp/${timestamp}-${shortUUID}`;
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: fileType });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return { url, key };
  }

  async deleteFiles(keys: string[]): Promise<void> {
    if (!keys.length) return;

    const deleteParams = {
      Bucket: this.bucket,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    };

    await this.s3Client.send(new DeleteObjectsCommand(deleteParams));
  }

  async moveFileToDestination(tempFileKey: string, destinationFolder: string): Promise<string> {
    // Extract file name from the temp path
    const fileName = tempFileKey.split('/').pop();
    if (!fileName) throw new Error('Invalid file path');

    // ✅ Dynamic folder name
    const finalFileKey = `${destinationFolder}/${fileName}`;

    // ✅ Copy file from `/temp/` to the dynamic destination folder
    await this.s3Client.send(
      new CopyObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        CopySource: `${process.env.AWS_S3_BUCKET}/${tempFileKey}`,
        Key: finalFileKey,
      })
    );

    // ✅ Delete the temp file after copy
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: tempFileKey,
      })
    );

    return finalFileKey; // ✅ Return the new file path
  }
}
