import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class LocalAdminAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    if (!request.user.permissions.includes(PermissionsEnum.ADMIN)) return false;

    await super.logIn(request);
    return result;
  }
}
