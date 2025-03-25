export class UpdateBrandTypeCommand {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}
}
