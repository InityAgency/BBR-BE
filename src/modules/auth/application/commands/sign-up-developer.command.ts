export class SignUpDeveloperCommand {
  constructor(
    public readonly fullName: string,
    public readonly companyName: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
