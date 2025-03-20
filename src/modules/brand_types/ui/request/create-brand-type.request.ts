import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBrandTypeRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;
}
