import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomInt, randomUUID } from 'crypto';
import { AuthConfig, GoogleConfig } from 'src/config/env.interface';
import { RedisService } from 'src/infrastructure/cache/redis/redis.service';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { UsersResponseDto } from 'src/module/users/dtos/users-response.dto';
import { UserMapper } from 'src/module/users/mappers/users.mapper';
import { UserModel } from 'src/module/users/models/users.model';
import { UsersRepositories } from 'src/module/users/repositories/users.repositories';
import { PasswordHashService } from 'src/shared/security/hashing/password-hash.service';
import { JwtPayload } from 'src/shared/security/token/jwt-payload.interface';
import { JwtTokenService } from 'src/shared/security/token/jwt-token.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { GoogleLoginDto } from './dtos/google-login.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { AuthLoginResponse } from './interfaces/auth-login-response.interface';
import { AuthRefreshResponse } from './interfaces/auth-refresh-response.interface';
import { AuthRefreshSession } from './interfaces/auth-refresh-session.interface';
import { GoogleTokenInfoResponse } from './interfaces/google-token-info-response.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authConfig: AuthConfig;
  private readonly googleConfig: GoogleConfig;
  /**
   * User thường luôn được gán roleId = 1 khi đăng ký.
   * Role không lấy từ frontend để tránh client tự nâng quyền.
   */
  private readonly defaultUserRoleId = 1;
  private readonly invalidCredentialsMessage = 'Invalid email or password';
  private readonly accountOtpPrefix = 'auth:otp:verify-account';
  private readonly resetPasswordOtpPrefix = 'auth:otp:reset-password';
  private readonly refreshSessionPrefix = 'auth:refresh-session';

  /*
    Inject repository/service cần cho auth và lấy config JWT, Google, OTP.
   */
  constructor(
    private readonly usersRepositories: UsersRepositories,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.getOrThrow<AuthConfig>('config.auth');
    this.googleConfig = configService.getOrThrow<GoogleConfig>('config.google');
  }

  /*
    Đăng ký tài khoản mới, lưu user vào MySQL và gửi OTP xác thực qua Redis/Mail.
   */
  async register(dto: RegisterDto): Promise<UsersResponseDto> {
    const existingUser = await this.usersRepositories.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await this.passwordHashService.generatePasswordHash(
      dto.password,
    );

    const user = await this.usersRepositories.createUser({
      role_id: this.defaultUserRoleId,
      email: dto.email,
      password_hash: passwordHash,
      first_name: dto.firstName,
      last_name: dto.lastName,
      phone_number: dto.phoneNumber,
      avatar_url: null,
      headline: '',
      current_position: '',
      years_of_experience: 0,
      linkedin_url: null,
      github_url: null,
      portfolio_url: null,
      is_verified: false,
    });

    await this.createAndSendOtp(this.accountOtpPrefix, user.email);
    this.logger.log(`Register success userId=${user.id} email=${user.email}`);

    return UserMapper.toResponseDto(user);
  }

  /*
    Đăng nhập bằng email/password và tạo access token, refresh token session.
   */
  async login(dto: LoginDto): Promise<AuthLoginResponse> {
    const user = await this.usersRepositories.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(this.invalidCredentialsMessage);
    }
    const isPasswordValid = await this.passwordHashService.verifyPasswordHash(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(this.invalidCredentialsMessage);
    }
    const updatedUser = await this.usersRepositories.updateLastLoginAt(
      user.id,
      new Date(),
    );
    this.logger.log(
      `Login success userId=${updatedUser.id} email=${updatedUser.email}`,
    );

    return this.createLoginResponse(updatedUser);
  }

  /**
   * Cấp access token mới khi refresh token còn hợp lệ và session Redis còn tồn tại.
   */
  async refreshToken(dto: RefreshTokenDto): Promise<AuthRefreshResponse> {
    const payload = await this.verifyRefreshPayload(dto.refreshToken);
    await this.assertRefreshSessionExists(payload);

    const accessTokenPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      roleId: payload.roleId,
    };
    const accessToken =
      await this.jwtTokenService.signAccessToken(accessTokenPayload);
    const tokenTtlSeconds = this.jwtTokenService.getTokenTtlSeconds();

    return {
      accessToken,
      accessTokenExpiresIn: tokenTtlSeconds.accessToken,
    };
  }

  /**
   * Đăng xuất bằng cách xóa refresh session tương ứng khỏi Redis.
   */
  async logout(dto: LogoutDto): Promise<void> {
    const payload = await this.verifyRefreshPayload(dto.refreshToken);
    await this.redisService.deleteValue(this.buildRefreshSessionKey(payload));
    this.logger.log(`Logout success userId=${payload.sub}`);
  }

  /**
   * Gửi OTP xác thực tài khoản, không báo lỗi khi email không tồn tại.
   */
  async sendAccountVerificationOtp(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersRepositories.findByEmail(dto.email);
    if (!user) {
      return;
    }

    await this.createAndSendOtp(this.accountOtpPrefix, user.email);
    this.logger.log(`Send OTP success email=${user.email}`);
  }

  /**
   * Xác thực OTP tài khoản và cập nhật trạng thái verified trong MySQL.
   */
  async verifyAccount(dto: VerifyAccountDto): Promise<UsersResponseDto> {
    await this.verifyOtp(this.accountOtpPrefix, dto.email, dto.otpCode);

    const user = await this.usersRepositories.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const verifiedUser = await this.usersRepositories.markAsVerified(user.id);
    await this.redisService.deleteValue(
      this.buildOtpKey(this.accountOtpPrefix, dto.email),
    );
    this.logger.log(`Verify OTP success email=${dto.email}`);

    return UserMapper.toResponseDto(verifiedUser);
  }

  /**
   * Gửi OTP reset mật khẩu, luôn trả response chung để tránh leak email.
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersRepositories.findByEmail(dto.email);
    if (!user) {
      return;
    }

    await this.createAndSendOtp(this.resetPasswordOtpPrefix, user.email);
    this.logger.log(`Send OTP success email=${user.email}`);
  }

  /**
   * Xác thực OTP reset password rồi cập nhật password_hash mới trong MySQL.
   */
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    await this.verifyOtp(this.resetPasswordOtpPrefix, dto.email, dto.otpCode);

    const user = await this.usersRepositories.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const passwordHash = await this.passwordHashService.generatePasswordHash(
      dto.newPassword,
    );
    await this.usersRepositories.updatePasswordHash(user.id, passwordHash);
    await this.redisService.deleteValue(
      this.buildOtpKey(this.resetPasswordOtpPrefix, dto.email),
    );
    this.logger.log(`Verify OTP success email=${dto.email}`);
  }

  /**
   * Đăng nhập bằng Google idToken, tạo user mới nếu email chưa tồn tại.
   */
  async googleLogin(dto: GoogleLoginDto): Promise<AuthLoginResponse> {
    const googleProfile = await this.verifyGoogleIdToken(dto.idToken);
    const email = googleProfile.email?.trim().toLowerCase();
    if (!email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    let user = await this.usersRepositories.findByEmail(email);
    if (!user) {
      user = await this.createGoogleUser(googleProfile, email);
    }

    const updatedUser = await this.usersRepositories.updateLastLoginAt(
      user.id,
      new Date(),
    );
    this.logger.log(
      `Login success userId=${updatedUser.id} email=${updatedUser.email}`,
    );

    return this.createLoginResponse(updatedUser);
  }

  /**
   * Tạo Google user mới với role USER mặc định, không áp dụng cho user đã tồn tại.
   */
  private async createGoogleUser(
    googleProfile: GoogleTokenInfoResponse,
    email: string,
  ): Promise<UserModel> {
    const fallbackPassword = randomInt(100000, 1000000).toString();
    const passwordHash =
      await this.passwordHashService.generatePasswordHash(fallbackPassword);
    const firstName =
      googleProfile.given_name || googleProfile.name || 'Google';
    const lastName = googleProfile.family_name || 'User';

    return this.usersRepositories.createUser({
      role_id: this.defaultUserRoleId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone_number: '',
      avatar_url: googleProfile.picture ?? null,
      headline: '',
      current_position: '',
      years_of_experience: 0,
      linkedin_url: null,
      github_url: null,
      portfolio_url: null,
      is_verified: this.isGoogleEmailVerified(googleProfile.email_verified),
      last_login_at: new Date(),
    });
  }

  /**
   * Verify Google idToken bằng Google tokeninfo và kiểm tra audience nếu có config.
   */
  private async verifyGoogleIdToken(
    idToken: string,
  ): Promise<GoogleTokenInfoResponse> {
    const response = await axios.get<GoogleTokenInfoResponse>(
      'https://oauth2.googleapis.com/tokeninfo',
      {
        params: {
          id_token: idToken,
        },
      },
    );

    if (
      this.googleConfig.clientId &&
      response.data.aud !== this.googleConfig.clientId
    ) {
      throw new UnauthorizedException('Invalid Google token');
    }

    return response.data;
  }

  /**
   * Tạo cặp token đăng nhập và lưu refresh session có TTL vào Redis.
   */
  private async createLoginResponse(
    user: UserModel,
  ): Promise<AuthLoginResponse> {
    const refreshTokenJti = randomUUID();
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    };
    const refreshTokenPayload: JwtPayload = {
      ...accessTokenPayload,
      jti: refreshTokenJti,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.signAccessToken(accessTokenPayload),
      this.jwtTokenService.signRefreshToken(refreshTokenPayload),
    ]);
    const tokenTtlSeconds = this.jwtTokenService.getTokenTtlSeconds();

    await this.redisService.setValue(
      this.buildRefreshSessionKey(refreshTokenPayload),
      JSON.stringify({
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        jti: refreshTokenJti,
        createdAt: new Date().toISOString(),
      } satisfies AuthRefreshSession),
      tokenTtlSeconds.refreshToken,
    );

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: tokenTtlSeconds.accessToken,
      refreshTokenExpiresIn: tokenTtlSeconds.refreshToken,
      user: UserMapper.toResponseDto(user),
    };
  }

  /**
   * Tạo OTP 6 số, lưu Redis có TTL và gửi qua MailService.
   */
  private async createAndSendOtp(
    keyPrefix: string,
    email: string,
  ): Promise<void> {
    const otpCode = this.generateOtpCode();
    await this.redisService.setValue(
      this.buildOtpKey(keyPrefix, email),
      otpCode,
      this.authConfig.otpTtlSeconds,
    );
    await this.mailService.sendOtpEmail(email, otpCode);
  }

  /**
   * Đối chiếu OTP request với OTP đang lưu tạm trong Redis.
   */
  private async verifyOtp(
    keyPrefix: string,
    email: string,
    otpCode: string,
  ): Promise<void> {
    const key = this.buildOtpKey(keyPrefix, email);
    const storedOtp = await this.redisService.getValue(key);

    if (!storedOtp || storedOtp !== otpCode) {
      throw new BadRequestException('Invalid or expired OTP');
    }
  }

  /**
   * Build Redis key cho OTP theo namespace auth và email đã normalize.
   */
  private buildOtpKey(keyPrefix: string, email: string): string {
    return `${keyPrefix}:${email}`;
  }

  /**
   * Build Redis key cho refresh session theo userId và jti của refresh token.
   */
  private buildRefreshSessionKey(
    payload: Pick<JwtPayload, 'sub' | 'jti'>,
  ): string {
    return `${this.refreshSessionPrefix}:${payload.sub}:${payload.jti}`;
  }

  /**
   * Verify refresh token và đảm bảo payload có jti để truy vết session Redis.
   */
  private async verifyRefreshPayload(
    refreshToken: string,
  ): Promise<JwtPayload> {
    const payload =
      await this.jwtTokenService.verifyRefreshToken<JwtPayload>(refreshToken);
    if (!payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return payload;
  }

  /**
   * Kiểm tra refresh session còn tồn tại trong Redis trước khi cấp token mới.
   */
  private async assertRefreshSessionExists(payload: JwtPayload): Promise<void> {
    const refreshSessionExists = await this.redisService.valueExists(
      this.buildRefreshSessionKey(payload),
    );
    if (!refreshSessionExists) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Sinh OTP 6 chữ số cho verify account hoặc reset password.
   */
  private generateOtpCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  /**
   * Chuẩn hóa trạng thái email verified trả về từ Google tokeninfo.
   */
  private isGoogleEmailVerified(value: boolean | string | undefined): boolean {
    return value === true || value === 'true';
  }
}
