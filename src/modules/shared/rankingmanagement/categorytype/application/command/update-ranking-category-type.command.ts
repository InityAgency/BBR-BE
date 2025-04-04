export class UpdateRankingCategoryTypeCommand {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}
}
