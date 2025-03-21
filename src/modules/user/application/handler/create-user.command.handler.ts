import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import { CreateUserCommand } from '../command/create-user.command';

@Injectable()
export class CreateUserCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await User.create(command);

    const createdUser = await this.userRepository.create(user);

    if (!createdUser) {
      throw new InternalServerErrorException('User not saved');
    }

    const created = await this.userRepository.findById(createdUser.id);

    if (!created) {
      throw new InternalServerErrorException('User not saved');
    }

    return created;
  }
}
