import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { CreateUserCommand } from './command/create-user.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

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
      throw new ConflictException('User already exists');
    }

    // Create the user entity
    const user = await User.create(command);

    const createdUser = await this.userRepository.create(user);

    if (!createdUser) {
      throw new InternalServerErrorException('User not saved');
    }

    // Return the created user with relations
    const created = await this.userRepository.findById(createdUser.id);

    if (!created) {
      throw new InternalServerErrorException('User not saved');
    }

    return created;
  }
}
