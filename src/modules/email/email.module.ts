import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IEmailRepository } from './domain/email.repository.interface';
import { EmailRepository } from './infrastructure/email.repository';
import { EmailController } from './ui/email.controller';
import { SendEmailCommandHandler } from './application/send-email.command.handler';
import * as path from 'path';

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
          secure: false,
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
  ],
  exports: [],
})
export default class EmailModule {}
