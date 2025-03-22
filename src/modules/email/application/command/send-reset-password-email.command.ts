export class SendResetPasswordEmailCommand {
  constructor(
    public readonly to: string,
    public readonly otp: string
  ) {}
}
