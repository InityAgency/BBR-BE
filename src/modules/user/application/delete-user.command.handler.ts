import { Injectable } from '@nestjs/common';
import { NotFoundByIdException } from 'src/shared/error/exception/not-found-by-id.exception';
import { ErrorSpecification } from 'src/shared/error/specs/error-specification';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class DeleteUserCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw NotFoundByIdException.notFoundByIdException(id, ErrorSpecification.USER_NOT_FOUND);
    }

    user.deletedAt = new Date();
    await this.userRepository.delete(user.id);
  }
}
