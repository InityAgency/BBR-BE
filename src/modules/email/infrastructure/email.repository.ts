import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IEmailRepository } from '../domain/email.repository.interface';

@Injectable()
export class EmailRepository implements IEmailRepository {
  constructor(private readonly mailerService: MailerService) {}

  @LogMethod()
  async sendEmail(
    to: string,
    subject: string,
    template: string,
    variables: Record<string, any>
  ): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject,
      template: template,
      context: variables,
    });
  }
}
