export class UpdateMediaCommand {
  constructor(
    public readonly id: string,
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly uploadedBy?: string
  ) {}
}
