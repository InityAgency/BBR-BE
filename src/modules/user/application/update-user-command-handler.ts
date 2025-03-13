import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { UpdateUserCommand } from './command/update-user.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { NotFoundByIdException } from 'src/shared/error/exception/not-found-by-id.exception';
import { ErrorSpecification } from 'src/shared/error/specs/error-specification';
import { AlreadyExistsException } from 'src/shared/error/exception/already-exist.exception';

@Injectable()
export class UpdateUserCommandHandler {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw NotFoundByIdException.notFoundByIdException(
        command.id,
        ErrorSpecification.USER_NOT_FOUND
      );
    }

    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      if (existingUser.id !== command.id) {
        throw AlreadyExistsException.alreadyExistsException(
          command.email,
          ErrorSpecification.USER_EMAIL_ALREADY_EXISTS
        );
      }
    }

    user.fullName = command.fullName;
    user.email = command.email;
    user.updatedAt = new Date();

    return this.userRepository.update(user);
  }
}
