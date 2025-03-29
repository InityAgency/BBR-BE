import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SendResetPasswordEmailCommandHandler } from '../../application/send-reset-password-email.command.handler';
import { SendWelcomeEmailCommandHandler } from '../../application/send-welcome-email.command.handler';
import { EmailAction } from '../../domain/email-action.enum';
import { SendWelcomeEmailCommand } from '../../application/command/send-welcome.command';
import { SendResetPasswordEmailCommand } from '../../application/command/send-reset-password-email.command';
import { SendVerifyEmailCommandHandler } from '../../application/send-verify-email.command.handler';
import { SendInviteEmailCommandHandler } from '../../application/send-invite-email.command.handler';
import { SendVerifyEmailCommand } from '../../application/command/send-verify-email.command';
import { SendInviteEmailCommand } from '../../application/command/send-invite-email.command';
import { Logger } from '@nestjs/common';
import { IProcessJob } from '../../domain/process-job.interface';
import { Job } from 'bullmq';

@Processor('email-queue')
export class EmailJobProcessor extends WorkerHost {
  constructor(
    private readonly resetPassword: SendResetPasswordEmailCommandHandler,
    private readonly verifyEmail: SendVerifyEmailCommandHandler,
    private readonly invite: SendInviteEmailCommandHandler,
    private readonly welcome: SendWelcomeEmailCommandHandler
  ) {
    super();
  }

  async process(job: Job) {
    const action = job.data.action as EmailAction;
    const data = job.data as IProcessJob;

    switch (action) {
      case EmailAction.WELCOME: {
        const command = new SendWelcomeEmailCommand(
          data.to,
          data.variables?.fullName,
          data.variables?.verifyEmailUrl
        );
        await this.welcome.handle(command);
        break;
      }

      case EmailAction.RESET_PASSWORD: {
        const command = new SendResetPasswordEmailCommand(data.to, data.variables?.otp);
        await this.resetPassword.handle(command);
        break;
      }
      case EmailAction.VERIFY_EMAIL: {
        const command = new SendVerifyEmailCommand(data.to, data.variables?.verificationLink);
        await this.verifyEmail.handle(command);
        break;
      }
      case EmailAction.INVITE: {
        const command = new SendInviteEmailCommand(
          data.to,
          data.variables?.inviteLink,
          data.variables?.tempPassword
        );
        await this.invite.handle(command);
        break;
      }

      default:
        throw new Error(`No handler found for action ${action}`);
    }
  }
}
