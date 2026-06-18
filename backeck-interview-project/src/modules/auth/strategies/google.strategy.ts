import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('googleOAuth.clientId'),
      clientSecret: configService.getOrThrow<string>(
        'googleOAuth.clientSecret',
      ),
      callbackURL: configService.getOrThrow<string>('googleOAuth.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  /**
   * Đồng bộ định danh Google với tài khoản nội bộ sau khi OAuth provider xác thực.
   *
   * @param accessToken Access token do Google cấp cho phiên OAuth hiện tại.
   * @param refreshToken Refresh token của Google nếu provider cấp.
   * @param profile Hồ sơ Google đã được Passport chuẩn hóa.
   * @returns Người dùng nội bộ đã sẵn sàng để phát hành token của hệ thống.
   * @throws UnauthorizedException Khi Google không trả về email.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<AuthenticatedUser> {
    void accessToken;
    void refreshToken;

    const email = profile.emails?.[0]?.value?.trim();

    if (!email) {
      throw new UnauthorizedException('Google không trả về email hợp lệ.');
    }

    return this.authService.validateGoogleProfile({
      email,
      fullName: profile.displayName?.trim(),
      firstName: profile.name?.givenName?.trim(),
      lastName: profile.name?.familyName?.trim(),
      avatarUrl: profile.photos?.[0]?.value?.trim(),
    });
  }
}
