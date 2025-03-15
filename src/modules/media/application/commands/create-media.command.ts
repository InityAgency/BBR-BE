export class CreateMediaCommand {
  constructor(
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly uploadedBy?: string
  ) {}
}
