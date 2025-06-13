export class SendOwnershipRequestDeclinedCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly manageResidencesLink: string
  ) {}
}
