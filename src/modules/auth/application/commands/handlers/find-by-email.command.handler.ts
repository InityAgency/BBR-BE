import { Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { FindByEmailCommand } from '../find-by-email.command';

@Injectable()
export class FindByEmailCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: FindByEmailCommand) {
    const user = this.authRepository.findByEmail(command.email);
    return user;
  }
}
