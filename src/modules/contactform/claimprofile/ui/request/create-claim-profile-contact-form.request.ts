import {  IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateClaimProfileContactFormRequest {
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

  @IsString()
  websiteUrl: string;

  @IsUUID()
  cvId: string;
}
