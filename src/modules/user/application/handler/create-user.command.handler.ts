import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import { CreateUserCommand } from '../command/create-user.command';
import { IInviteRepository } from '../../domain/invite.repository.interface';
import { InviteUserCommandHandler } from './invite-user-command.handler';
import { InviteUserCommand } from '../command/invite-user.command';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

@Injectable()
export class CreateUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly inviteUserCommandHandler: InviteUserCommandHandler
  ) {}

  @LogMethod()
  async handle(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const { createdBy, ...commandUser } = command;

    const createdUser = await User.create({ status: UserStatusEnum.INACTIVE, ...commandUser });

    if (!createdUser) {
      throw new InternalServerErrorException('User not saved');
    }

    // * send invite link
    if (command.emailNotifications) {
      const inviteUserCommand = new InviteUserCommand(
        command.email,
        command.roleId,
        command.password,
        createdBy!
      );

      await this.inviteUserCommandHandler.handle(inviteUserCommand);
    }

    const created = await this.userRepository.findById(createdUser.id);

    if (!created) {
      throw new InternalServerErrorException('User not saved');
    }

    return created;
  }
}
