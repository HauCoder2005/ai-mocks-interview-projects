import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  
  /**
   * Inject Reflector để đọc metadata roleId được khai báo trên endpoint.
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Chặn request nếu user trong JWT không có roleId được phép.
   */
  canActivate(context: ExecutionContext): boolean {
    const allowedRoleIds =
      this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    if (allowedRoleIds.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const roleId = request.user?.roleId;
    if (!allowedRoleIds.includes(roleId)) {
      throw new ForbiddenException('Forbidden resource');
    }
    return true;
  }
}
