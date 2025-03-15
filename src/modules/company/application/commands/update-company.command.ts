export class UpdateCompanyCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address?: string,
    public readonly logo?: string,
    public readonly phoneNumber?: string,
    public readonly phoneNumberCountryCode?: string,
    public readonly website?: string,
    public readonly contactPersonAvatar?: string,
    public readonly contactPersonFullName?: string,
    public readonly contactPersonJobTitle?: string,
    public readonly contactPersonEmail?: string,
    public readonly contactPersonPhoneNumber?: string,
    public readonly contactPersonPhoneNumberCountryCode?: string
  ) {}
}
