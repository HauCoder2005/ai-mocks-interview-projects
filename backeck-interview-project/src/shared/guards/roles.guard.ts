import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';

interface RequestUserWithRole {
  role?: string;
}

interface RequestWithOptionalUser {
  user?: RequestUserWithRole;
}

/**
 * Guard phân quyền theo metadata từ decorator `@Roles()`.
 *
 * Guard đặt ở shared để mọi module dùng chung một cơ chế kiểm tra quyền, trong
 * khi giá trị role cụ thể vẫn thuộc về domain hoặc module nghiệp vụ.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<RequestWithOptionalUser>();
    const userRole = request.user?.role;

    if (!userRole) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện thao tác này.',
      );
    }

    return true;
  }
}
