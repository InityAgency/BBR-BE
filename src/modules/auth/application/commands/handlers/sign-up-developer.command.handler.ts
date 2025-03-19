import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { SignUpDeveloperCommand } from '../sign-up-developer.command';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

@Injectable()
export class SignUpDeveloperCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: SignUpDeveloperCommand) {
    const existingUser = await this.authRepository.findByEmail(command.email!);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // find user role 'Developer' by name
    const role = await this.authRepository.findRoleByName('Developer');

    if (!role) {
      throw new BadRequestException('User can not be created');
    }

    const user = {
      email: command.email,
      fullName: command.fullName,
      password: command.password,
      companyName: command.companyName,
      roleId: role.id,
      signupMethod: SignupMethodEnum.EMAIL,
      status: UserStatusEnum.INACTIVE,
    };

    return this.authRepository.create(user);
  }
}
