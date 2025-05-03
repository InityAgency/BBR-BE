import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';

@Injectable()
export class FindClaimProfileContactFormByIdCommandQuery {
  constructor(private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository) {}

  @LogMethod()
  async handle(id: string): Promise<ClaimProfileContactForm> {
    const claimProfileContactForm = await this.claimProfileContactFormRepository.findById(id);
    if (!claimProfileContactForm) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }
    return claimProfileContactForm;
  }
}
