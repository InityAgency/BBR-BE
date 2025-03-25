import { IsNotEmpty } from 'class-validator';

export class UpdateBrandTypeRequest {
  @IsNotEmpty()
  name: string;
}
