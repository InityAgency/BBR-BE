import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IEmailRepository } from './domain/email.repository.interface';
import { EmailRepository } from './infrastructure/email.repository';
import { EmailController } from './ui/email.controller';
import * as path from 'path';
import { SendResetPasswordEmailCommandHandler } from './application/send-reset-password-email.command.handler';
import { SendEmailCommandHandler } from './application/send-email.command.handler';
import { SendWelcomeEmailCommandHandler } from './application/send-welcome-email.command.handler';
import { EmailQueue } from './infrastructure/queues/email.queue';
import { EmailJobProcessor } from './infrastructure/jobs/email.job';
import { SendVerifyEmailCommandHandler } from './application/send-verify-email.command.handler';
import { SendInviteEmailCommandHandler } from './application/send-invite-email.command.handler';

@Module({
  controllers: [EmailController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: config.get('SMTP_SECURE') == 1,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('SMTP_USER')}>`,
        },
        template: {
          dir: path.join(
            __dirname,
            '..',
            '..',
            '..',
            'modules',
            'email',
            'infrastructure',
            'templates'
          ),
          adapter: new HandlebarsAdapter(),
        },
        options: {
          strict: true,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: IEmailRepository,
      useClass: EmailRepository,
    },
    SendEmailCommandHandler,
    SendWelcomeEmailCommandHandler,
    SendResetPasswordEmailCommandHandler,
    SendVerifyEmailCommandHandler,
    SendInviteEmailCommandHandler,
    EmailJobProcessor,
    EmailQueue,
  ],
  exports: [EmailQueue],
})
export default class EmailModule {}
