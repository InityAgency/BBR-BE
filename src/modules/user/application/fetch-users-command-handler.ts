import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { FetchUserQuery } from './command/fetch-user.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { UserResponse } from '../ui/response/user-response';

@Injectable()
export class FetchUsersCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(
    query: FetchUserQuery
  ): Promise<{ data: UserResponse[]; pagination: PaginationResponse }> {
    return this.userRepository.findAll(query.page, query.limit);
  }
}
