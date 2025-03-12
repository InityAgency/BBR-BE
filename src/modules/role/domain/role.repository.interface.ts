import { Role } from './role.entity';

export abstract class IRoleRepository {
  abstract createRole(name: string): Promise<Role>;
  abstract assignPermission(roleId: string, permissionId: string): Promise<void>;
  abstract getPermissions(roleId: string): Promise<string[]>;
}
