import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLifestyleRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  imageId: string;

  @IsOptional()
  @IsNumber()
  order: number;
}
