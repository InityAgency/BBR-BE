import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserRequest {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}
