import { Injectable } from '@nestjs/common';
import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class GetRolesQuery {
  constructor(private readonly roleRepository: IRoleRepository) {}

  @LogMethod()
  async handler() {
    const roles = await this.roleRepository.getRoles();
    return roles;
  }
}
