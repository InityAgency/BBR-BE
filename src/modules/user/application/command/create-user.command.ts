import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';

export class CreateUserCommand {
  fullName: string;
  email: string;
  password: string;
  signupMethod: SignupMethodEnum;
  roleId?: string;
}
