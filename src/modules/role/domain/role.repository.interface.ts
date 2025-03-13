import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Role } from './role.entity';

export abstract class IRoleRepository {
  abstract createRole(name: string): Promise<Role>;
  abstract assignPermission(roleId: string, permissionId: string): Promise<void>;
  abstract getPermissions(roleId: string): Promise<string[]>;
  abstract findAll(
    page: number,
    limit: number
  ): Promise<{ data: Role[]; pagination: PaginationResponse }>;
}
