import { IsEmail, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class UpdateUserRequest {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsObject({ message: 'Additional fields must be an object' })
  additional_fields?: Record<string, any>;
}
