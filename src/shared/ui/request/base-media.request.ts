import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaFileRequest } from './media-file.request';

export class BaseMediaRequest {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // ✅ Ensures validation for each media item
  @Type(() => MediaFileRequest)
  uploads?: MediaFileRequest[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleted?: string[];
}
