import { IsString, IsOptional, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { PreferredContactMethodEnum } from '../../domain/preferred-contact-method.enum';

export class CreateLeadRequest {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone: string | null;

  @IsOptional()
  @IsEnum(PreferredContactMethodEnum)
  readonly preferredContactMethod: PreferredContactMethodEnum | null;
}
