export class SendAcceptedResidenceCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly manageResidencesLink: string
  ) {}
}
