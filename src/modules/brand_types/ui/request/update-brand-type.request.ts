import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandTypeRequest {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;
}
