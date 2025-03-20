import { IsString, IsOptional } from 'class-validator';

export class MediaFileRequest {
  @IsString()
  fileName!: string;

  @IsString()
  fileType!: string;

  @IsString()
  uploadedBy!: string;

  @IsString()
  mediaType!: string; // ✅ New field to define whether it's "logo" or "gallery"

  @IsOptional()
  @IsString()
  id?: string;
}
