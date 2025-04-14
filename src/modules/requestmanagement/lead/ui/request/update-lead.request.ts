import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { PreferredContactMethodEnum } from '../../domain/preferred-contact-method.enum';

export class UpdateLeadRequest {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly phone: string;

  @IsOptional()
  @IsEnum(PreferredContactMethodEnum)
  readonly preferredContactMethod: PreferredContactMethodEnum | null;
}
