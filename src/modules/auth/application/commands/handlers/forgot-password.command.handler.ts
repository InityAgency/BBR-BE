import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { ForgotPasswordCommand } from '../forgot-password.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class ForgotPasswordCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: ForgotPasswordCommand) {
    const user = await this.authRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const resetToken = Math.random().toString(36).substr(2);

    await this.authRepository.saveResetToken(user.id, resetToken);

    return { message: 'Password reset link sent to email', token: resetToken };
  }
}
