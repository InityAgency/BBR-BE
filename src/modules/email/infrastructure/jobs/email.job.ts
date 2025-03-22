import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SendResetPasswordEmailCommandHandler } from '../../application/send-reset-password-email.command.handler';
import { SendWelcomeEmailCommandHandler } from '../../application/send-welcome-email.command.handler';
import { EmailAction } from '../../domain/email-action.enum';
import { SendWelcomeEmailCommand } from '../../application/command/send-welcome.command';
import { SendResetPasswordEmailCommand } from '../../application/command/send-reset-password-email.command';

@Processor('email-queue')
export class EmailJobProcessor extends WorkerHost {
  constructor(
    private readonly resetPassword: SendResetPasswordEmailCommandHandler,
    private readonly welcome: SendWelcomeEmailCommandHandler
  ) {
    super();
  }

  async process(job: any) {
    const { action, data } = job.data;

    switch (action) {
      case EmailAction.WELCOME: {
        const command = new SendWelcomeEmailCommand(data.to, data.fullName, data.verifyEmailUrl);
        await this.welcome.handle(command);
        break;
      }

      case EmailAction.RESET_PASSWORD: {
        const command = new SendResetPasswordEmailCommand(data.to, data.otp);
        await this.resetPassword.handle(command);
        break;
      }

      default:
        throw new Error(`No handler found for action ${action}`);
    }
  }
}
