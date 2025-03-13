import { Injectable, Query } from '@nestjs/common';
import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationRequest } from 'src/shared/ui/request/pagination.request';
import { FetchRolesQuery } from '../fetch-roles.query';

@Injectable()
export class FetchRolesCommandQuery {
  constructor(private readonly roleRepository: IRoleRepository) {}

  @LogMethod()
  async handler(query: FetchRolesQuery) {
    const roles = await this.roleRepository.findAll(query.page, query.limit);
    return roles;
  }
}
