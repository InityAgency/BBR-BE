import { PreferredContactMethodEnum } from '../../domain/preferred-contact-method.enum';

export class UpdateLeadCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly preferredContactMethod: PreferredContactMethodEnum | null,
  ) {}
}
