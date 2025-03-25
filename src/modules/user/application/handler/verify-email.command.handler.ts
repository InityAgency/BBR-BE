import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IEmailVerificationRepository } from '../../domain/email-verification.repository.interface';
import { VerificationCommand } from '../command/verification.command';
import { User } from '../../domain/user.entity';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

@Injectable()
export class VerifyEmailCommandHandler {
  constructor(private readonly repo: IEmailVerificationRepository) {}

  async handle(command: VerificationCommand): Promise<void> {
    const request = await this.repo.findByToken(command.token);

    if (!request || request.isVerified) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.repo.markAsVerified(request.id);

    await User.query()
      .patch({ emailVerified: true, status: UserStatusEnum.ACTIVE })
      .where({ id: request.userId });
  }
}
