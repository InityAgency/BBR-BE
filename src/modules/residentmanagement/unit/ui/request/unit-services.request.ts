import { IsNumber, IsString } from 'class-validator';

export class UnitServicesRequest {
  @IsString()
  name: string;

  @IsNumber()
  amount: string;
}
