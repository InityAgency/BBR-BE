export class RankingCriteriaResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly weight: number
  ) {}
}
