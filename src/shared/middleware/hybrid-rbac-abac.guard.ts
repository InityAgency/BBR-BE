import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RedisService } from '../cache/redis.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ABAC_KEY } from '../decorators/abac.decorator';
import { Reflector } from '@nestjs/core';
import { KnexService } from '../infrastructure/database/knex.service';

@Injectable()
export class HybridRBACABACGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly knexService: KnexService,
    private readonly redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) throw new ForbiddenException('User not authenticated');

    // ✅ Load RBAC Permissions
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
    if (requiredPermissions) {
      const cachedPermissions = await this.redisService.getCache(`user-permissions:${user.id}`);

      let userPermissions;
      if (cachedPermissions) {
        userPermissions = cachedPermissions;
      } else {
        const permissions = await this.knexService
          .connection('role_permissions as rp')
          .select('p.name')
          .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
          .leftJoin('users as u', 'u.role_id', 'rp.role_id')
          .where('u.id', user.id);

        userPermissions = permissions.map((p) => p.name);
        await this.redisService.setCache(`user-permissions:${user.id}`, userPermissions, 3600);
      }

      // ✅ RBAC: Check if user has required permissions
      const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));
      if (!hasPermission) throw new ForbiddenException('Insufficient permissions');
    }

    // ✅ Load ABAC Rules
    const abacCondition = this.reflector.get<(user: any, req: any) => boolean>(
      ABAC_KEY,
      context.getHandler()
    );
    if (abacCondition && !abacCondition(user, request)) {
      throw new ForbiddenException('ABAC policy denied access');
    }

    return true;
  }
}
