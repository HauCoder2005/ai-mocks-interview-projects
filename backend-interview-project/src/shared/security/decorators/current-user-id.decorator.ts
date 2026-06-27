import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { JwtAuthUser } from '../token/jwt-payload.interface';

/*
 * Lấy user id hiện tại từ request.user sau khi JwtAccessGuard verify access token.
 * Dùng cho created_by, updated_by hoặc các API cần biết user hiện tại.
 */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest<{
      user?: JwtAuthUser;
    }>();

    if (!request.user?.id) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    return request.user.id;
  },
);
