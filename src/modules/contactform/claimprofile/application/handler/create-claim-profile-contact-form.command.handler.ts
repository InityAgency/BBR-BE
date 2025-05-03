import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { IPhoneCodeRepository } from 'src/modules/shared/phone_code/domain/phone-code.repository.interface';
import { PhoneCode } from 'src/modules/shared/phone_code/domain/phone-code.entity';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { CreateClaimProfileContactFormCommand } from '../command/create-claim-profile-contact-form.command';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';

@Injectable()
export class CreateClaimProfileContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: IClaimProfileContactFormRepository,
    private readonly phoneCodeRepository: IPhoneCodeRepository,
    private readonly mediaRepository: IMediaRepository,
  ) {}

  @LogMethod()
  async handle(command: CreateClaimProfileContactFormCommand): Promise<ClaimProfileContactForm> {
    let phoneCode: PhoneCode | undefined = undefined;
    if (command.phoneCodeId) {
      phoneCode = await this.phoneCodeRepository.findById(command.phoneCodeId);
      if (!phoneCode) {
        throw new NotFoundException('Phone code not found');
      }
    }

    let cv = await this.mediaRepository.findById(command.cvId);
      if (!cv) {
        throw new NotFoundException('Media not found');
      }

    const contactFormData: Partial<ClaimProfileContactForm> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phoneCode: phoneCode,
      phoneNumber: command.phoneNumber,
      websiteUrl: command.websiteUrl,
      cv: cv,
      status: ClaimProfileContactFormStatus.NEW,
    };

    const createdContactForm = await this.contactFormRepository.create(contactFormData);

    if (!createdContactForm) {
      throw new InternalServerErrorException('Contact form could not be saved');
    }

    return createdContactForm;
  }
}
