import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendAcceptedResidenceCommand } from './command/send-accepted-residence.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { SendRejectedResidenceCommand } from './command/send-rejected-residence.command';

@Injectable()
export class SendRejectedResidenceCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendRejectedResidenceCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      'Your Residence Needs Attention',
      EmailTemplatesEnum.REJECTED_RESIDENCE,
      {
        fullName: command.fullName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
