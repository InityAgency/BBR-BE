import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SignupMethodEnum } from 'src/usermanagement/domain/enums/signup-method.enum';

export class CreateUserRequest {
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(64, { message: 'First name must be at most 64 characters long' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(128, { message: 'Last name must be at most 128 characters long' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(128, { message: 'Email must be at most 128 characters long' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;

  @IsEnum(SignupMethodEnum, { message: 'Invalid signup method' })
  signupMethod: SignupMethodEnum;

  @IsNotEmpty({ message: 'Role is required' })
  roleId: string;
}
