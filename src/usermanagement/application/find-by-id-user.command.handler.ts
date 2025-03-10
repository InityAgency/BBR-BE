import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { NotFoundByIdException } from 'src/shared/error/exception/not-found-by-id.exception';
import { ErrorSpecification } from 'src/shared/error/specs/error-specification';

@Injectable()
export class FindByIdUserCommandHandler {
  // TODO: Check how to inject without annotation
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw NotFoundByIdException.notFoundByIdException(id, ErrorSpecification.USER_NOT_FOUND);
    }
    return user;
  }
}
