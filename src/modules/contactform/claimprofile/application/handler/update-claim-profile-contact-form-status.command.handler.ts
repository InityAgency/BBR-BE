import { Injectable } from '@nestjs/common';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { UpdateClaimProfileContactFormStatusCommand } from '../command/update-claim-profile-contact-form-status.command';

@Injectable()
export class UpdateClaimProfileContactFormStatusCommandHandler {
  constructor(
    private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository,
  ) {}

  async handle(command: UpdateClaimProfileContactFormStatusCommand): Promise<ClaimProfileContactForm> {
    const claimProfileContactForm = await this.claimProfileContactFormRepository.findById(command.id);
    if (!claimProfileContactForm) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }

    const updateData: Partial<ClaimProfileContactForm> = {
      firstName:  claimProfileContactForm.firstName,
      lastName: claimProfileContactForm.lastName,
      email:  claimProfileContactForm.email,
      phoneCode:  claimProfileContactForm.phoneCode,
      phoneNumber: claimProfileContactForm.phoneNumber,
      websiteUrl:  claimProfileContactForm.websiteUrl,
      cv: claimProfileContactForm.cv,
      status: command.status,
    };

    const updatedContactForm = await this.claimProfileContactFormRepository.update(claimProfileContactForm.id, updateData);
    if (!updatedContactForm) {
      throw new InternalServerErrorException('Claim Profile Contact Form not updated');
    }

    return updatedContactForm;
  }
}
