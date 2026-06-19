import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard xác thực JWT dùng chung cho các endpoint cần access token.
 *
 * Guard chỉ xử lý trách nhiệm hạ tầng là xác thực request qua Passport strategy;
 * nghiệp vụ ánh xạ payload sang user vẫn nằm ở strategy của module auth.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method === 'OPTIONS') {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    error: Error | null,
    user: TUser | false,
  ): TUser {
    if (error || !user) {
      throw error ?? new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    return user;
  }
}
