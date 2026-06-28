import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../token/jwt-payload.interface';
import { JwtTokenService } from '../token/jwt-token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  /*
   * Inject JwtTokenService để verify Bearer access token từ request.
   */
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  /*
   * Verify access token và gắn user vào request cho service/controller dùng.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers?.authorization;
    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Missing access token');
    }
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid access token');
    }
    const payload =
      await this.jwtTokenService.verifyAccessToken<JwtPayload>(token);
    request.user = {
      id: payload.sub,
      email: payload.email,
      roleId: payload.roleId,
      role_id: payload.roleId,
      jti: payload.jti,
    };
    return true;
  }
}
