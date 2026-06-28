import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
/*
 * Guard kiểm tra user hiện tại có quyền Admin hay không.
 * Guard này chạy sau JwtAccessGuard nên request.user phải tồn tại.
 */
@Injectable()
export class AdminRoleGuard implements CanActivate {
  /*
   * Kiểm tra role_id của user trong access token.
   * role_id = 1 là user thường.
   * role_id = 2 là admin.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Authenticated user not found');
    }
    if (Number(user.role_id) !== 2) {
      throw new ForbiddenException('Admin permission required');
    }
    return true;
  }
}
