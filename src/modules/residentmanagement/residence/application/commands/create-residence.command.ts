export class CreateResidenceCommand {
  constructor(
    public readonly name: string,
    public readonly websiteUrl: string,
    public readonly subtitle: string,
    public readonly description: string,
    public readonly budgetStartRange: string,
    public readonly budgetEndRange: string,
    public readonly address: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly brandId: string,
    public readonly countryId: string,
    public readonly cityId: string
  ) {}
}
