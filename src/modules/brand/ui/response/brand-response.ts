export class BrandResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: string,
    public readonly status: string,
    public readonly registeredAt: Date
  ) {}
}
