import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { CreateUserCommand } from './command/create-user.command';
import { PasswordEncoder } from 'src/shared/passwordEncoder/password-encoder.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { AlreadyExistsException } from 'src/shared/error/exception/already-exist.exception';
import { ErrorSpecification } from 'src/shared/error/specs/error-specification';
import { NotSavedException } from 'src/shared/error/exception/not-saved.exception';

@Injectable()
export class CreateUserCommandHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  @LogMethod()
  async handle(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw AlreadyExistsException.alreadyExistsException(
        command.email,
        ErrorSpecification.USER_EMAIL_ALREADY_EXISTS
      );
    }

    // Create the user entity
    const user = await User.create(command);

    // Save the user
    return await this.userRepository.create(user);
  }
}
