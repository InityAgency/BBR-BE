export class CreateUserCommand {
  fullName: string;
  email: string;
  password: string;
  signupMethod: string;
  roleId?: string;
}
