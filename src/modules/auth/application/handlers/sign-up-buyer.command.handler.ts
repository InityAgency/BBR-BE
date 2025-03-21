import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';
import { SignUpBuyerCommand } from '../commands/sign-up-buyer.command';

@Injectable()
export class SignUpBuyerCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: SignUpBuyerCommand) {
    const existingUser = await this.authRepository.findByEmail(command.email!);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // find user role 'Buyer' by name
    const role = await this.authRepository.findRoleByName('Buyer');

    if (!role) {
      throw new BadRequestException('User can not be created');
    }

    const user = {
      email: command.email,
      fullName: command.fullName,
      password: command.password,
      roleId: role.id,
      signupMethod: SignupMethodEnum.EMAIL,
      status: UserStatusEnum.INACTIVE,
    };

    return this.authRepository.create(user);
  }
}
