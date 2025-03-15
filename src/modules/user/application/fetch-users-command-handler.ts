import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUserRepository } from '../domain/user.repository.interface';
import { FetchUsersQuery } from './command/fetch-users.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { UserResponse } from '../ui/response/user-response';

@Injectable()
export class FetchUsersCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(
    query: FetchUsersQuery
  ): Promise<{ data: UserResponse[]; pagination: PaginationResponse }> {
    return this.userRepository.findAll(query.page, query.limit);
  }
}
