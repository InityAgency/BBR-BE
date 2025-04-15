import { RequestTypeEnum } from '../../domain/request-type.enum';
import { PreferredContactMethodEnum } from '../../../lead/domain/preferred-contact-method.enum';

export class CreateRequestCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly subject: string,
    public readonly message: string,
    public readonly preferredContactMethod: PreferredContactMethodEnum,
    public readonly termsAccepted: boolean,
    public readonly entityId: string,
    public readonly type: RequestTypeEnum
  ) {}
}
