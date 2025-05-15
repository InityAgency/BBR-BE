import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
