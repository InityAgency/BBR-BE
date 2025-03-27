export class UpdateLifestyleCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly imageId?: string,
    public readonly order?: number
  ) {}
}
