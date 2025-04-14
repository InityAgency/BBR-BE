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

export class UpdateRequestRequest {

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  note: string;

  @IsNotEmpty()
  @IsEnum(RequestStatusEnum)
  status: RequestStatusEnum;
}
