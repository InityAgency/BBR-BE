import { IsNotEmpty, IsString, MaxLength, IsUUID, IsEnum } from 'class-validator';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';

export class UpdateClaimProfileContactFormRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsUUID()
  phoneCodeId: string;

  @IsNotEmpty()
  @IsString()
  websiteUrl: string;

  @IsUUID()
  cvId: string;

  @IsNotEmpty()
  @IsEnum(ClaimProfileContactFormStatus)
  status: ClaimProfileContactFormStatus;
}
