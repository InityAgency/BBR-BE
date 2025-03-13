import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { ValidateUserCommand } from '../validate-user.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class ValidateUserCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: ValidateUserCommand) {
    const user = await this.authRepository.findByEmail(command.email);

    if (user && !user.password && user.signupMethod === 'google') {
      throw new BadRequestException('Login with Google Account');
    }

    if (!user || !(await bcrypt.compare(command.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
