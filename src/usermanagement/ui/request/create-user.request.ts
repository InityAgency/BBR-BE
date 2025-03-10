import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  @MaxLength(64)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(128)
  lastName: string;

  @IsEmail()
  @MaxLength(128)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
