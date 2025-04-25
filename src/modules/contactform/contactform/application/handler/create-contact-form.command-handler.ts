import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ContactForm } from '../../domain/contact-form.entity';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { Media } from 'src/modules/media/domain/media.entity';
import { CreateContactFormCommand } from '../command/create-contact-form.command';
import { IContactFormRepository } from '../../domain/contact-form.repository.interface';

@Injectable()
export class CreateContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: IContactFormRepository,
    private readonly mediaRepository: IMediaRepository,
  ) {}

  @LogMethod()
  async handle(command: CreateContactFormCommand): Promise<ContactForm> {
    const attachment = await this.mediaRepository.findById(command.attachmentId);
    if (!attachment) {
      throw new NotFoundException('Media not found');
    }

    const contactFormData: Partial<ContactForm> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      link: command.link,
      type: command.type,
      description: command.description,
      attachment: attachment,
    };

    const createdContactForm = await this.contactFormRepository.create(contactFormData);

    if (!createdContactForm) {
      throw new InternalServerErrorException('Contact Form could not be saved');
    }

    return createdContactForm;
  }
}
