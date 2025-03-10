import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class FetchUsersCommandHandler {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
