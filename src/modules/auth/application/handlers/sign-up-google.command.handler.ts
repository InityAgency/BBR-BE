import { ConflictException, Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { SignUpGoogleCommand } from '../commands/sign-up-google.command';

@Injectable()
export class SignUpGoogleCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: SignUpGoogleCommand) {
    let findedUser = await this.authRepository.findByEmail(command.email!);

    if (findedUser) {
      throw new ConflictException('User already exists, please login instead.');
    }

    const user = {
      email: command.email,
      fullName: command.fullName,
      signupMethod: command.signupMethod,
      emailVerified: command.emailVerified,
      roleId: command.roleId,
    };

    return await this.authRepository.create(user);
  }
}
