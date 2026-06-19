import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppRole } from '../enums/app-role.enum';
import { AuthTokenType } from '../enums/auth-token-type.enum';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  /**
   * Chuyển payload đã được Passport xác thực chữ ký thành user tối thiểu cho request.
   *
   * @param payload Payload JWT đã qua bước xác minh chữ ký và hạn dùng.
   * @returns Thông tin người dùng cần thiết cho guard và controller.
   * @throws UnauthorizedException Khi token không phải access token hoặc vai trò không hợp lệ.
   */
  validate(payload: JwtPayload): AuthenticatedUser {
    if (payload.type !== AuthTokenType.ACCESS) {
      throw new UnauthorizedException('Loại token không hợp lệ.');
    }

    if (!Object.values(AppRole).includes(payload.role)) {
      throw new UnauthorizedException('Vai trò trong token không hợp lệ.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
