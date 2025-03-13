export class SignUpGoogleCommand {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly signupMethod: string,
    public readonly emailVerified: boolean
  ) {}
}
