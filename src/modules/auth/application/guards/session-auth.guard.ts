import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    if (!request.isAuthenticated || !request.isAuthenticated()) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
