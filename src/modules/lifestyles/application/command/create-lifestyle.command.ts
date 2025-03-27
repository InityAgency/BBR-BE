export class CreateLifestyleCommand {
  constructor(
    public readonly name: string,
    public readonly imageId: string,
    public readonly order: number
  ) {}
}
