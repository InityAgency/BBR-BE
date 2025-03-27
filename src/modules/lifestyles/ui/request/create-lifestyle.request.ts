import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLifestyleRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  imageId: string;

  @IsOptional()
  @IsNumber()
  order: number;
}
