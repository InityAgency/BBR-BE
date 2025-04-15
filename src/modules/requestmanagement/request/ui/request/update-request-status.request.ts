import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches, IsUUID,
} from 'class-validator';
import { RequestTypeEnum } from '../../domain/request-type.enum';
import { PreferredContactMethodEnum } from 'src/modules/requestmanagement/lead/domain/preferred-contact-method.enum';
import { RequestStatusEnum } from '../../domain/request-status.enum';

export class UpdateRequestStatusRequest {

  @IsNotEmpty()
  @IsEnum(RequestStatusEnum)
  status: RequestStatusEnum;
}
