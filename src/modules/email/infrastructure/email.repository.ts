import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
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
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: template,
        context: { ...variables },
      });
    } catch (e: any) {
      Logger.error(e);
    }
  }
  @LogMethod()
  async sendInvoice(to: string, subject: string, pdf: string, html: string): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'invoice',
        context: { pdf, html },
      });
    } catch (e: any) {
      Logger.error(e);
    }
  }
}
