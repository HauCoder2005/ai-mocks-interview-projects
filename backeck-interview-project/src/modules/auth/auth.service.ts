import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Cache } from 'cache-manager';
import type { CookieOptions, Response } from 'express';
import { randomInt, randomUUID } from 'node:crypto';
import { MailService } from '../mail/mail.service';
import { UserRecordWithRole, UsersService } from '../users/users.service';
import { AUTH_CONSTANTS } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AppRole } from './enums/app-role.enum';
import { AuthTokenType } from './enums/auth-token-type.enum';
import type {
  AuthTokenResponse,
  AuthUserResponse,
  MessageResponse,
} from './interfaces/auth-response.interface';
import type {
  AuthenticatedRequest,
  RequestWithCookies,
} from './interfaces/auth-request.interface';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import type { GoogleUserProfile } from './interfaces/google-user-profile.interface';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Service xử lý nghiệp vụ xác thực.
 *
 * Service chịu trách nhiệm điều phối đăng ký, xác minh email, đăng nhập,
 * refresh token và OAuth. Mọi truy cập database, mail và cache đều đi qua DI
 * để giữ ranh giới hạ tầng rõ ràng.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Tạo tài khoản local ở trạng thái chưa xác minh và phát hành OTP ngắn hạn.
   *
   * @param registerDto Dữ liệu đăng ký đã được validate ở biên HTTP.
   * @returns Thông báo kết quả đăng ký.
   * @throws ConflictException Khi email đã tồn tại trong hệ thống.
   */
  async register(registerDto: RegisterDto): Promise<MessageResponse> {
    const email = this.normalizeEmail(registerDto.email);
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng.');
    }

    const { firstName, lastName } = this.splitFullName(registerDto.fullName);
    const passwordHash = await bcrypt.hash(
      registerDto.password,
      this.bcryptSaltRounds,
    );
    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName,
      lastName,
      roleName: AppRole.USER,
    });

    const otp = await this.issueEmailVerificationOtp(user.id);

    this.logger.debug(`Bắt đầu gửi OTP qua MailService cho email=${email}.`);
    void this.mailService.sendOtpEmail(email, otp);

    return {
      message:
        'Đăng ký thành công. Vui lòng xác minh email bằng OTP trong 5 phút.',
    };
  }

  /**
   * Xác minh OTP email và chỉ kích hoạt tài khoản khi OTP khớp với hash trong Redis.
   *
   * @param verifyEmailDto Email và OTP 6 chữ số do người dùng gửi lên.
   * @returns Thông báo xác minh thành công.
   * @throws BadRequestException Khi OTP sai, hết hạn hoặc tài khoản đã xác minh.
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<MessageResponse> {
    const email = this.normalizeEmail(verifyEmailDto.email);
    const user = await this.usersService.findByEmail(email);

    if (!user || user.is_verified) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn.');
    }

    const redisKey = AUTH_CONSTANTS.REDIS_KEYS.verifyOtp(user.id);
    const otpHash = await this.getCacheValue<string>(redisKey);

    if (!this.isNonEmptyString(otpHash)) {
      throw new BadRequestException('Mã OTP đã hết hạn hoặc không tồn tại.');
    }

    const isOtpValid = await bcrypt.compare(verifyEmailDto.otp, otpHash);

    if (!isOtpValid) {
      throw new BadRequestException('OTP không hợp lệ.');
    }

    await this.usersService.updateVerificationStatus(user.id, true);
    await this.deleteCacheValue(redisKey);

    return {
      message: 'Email đã được xác minh thành công.',
    };
  }

  /**
   * Xác thực tài khoản local, lưu hash refresh token vào Redis và gắn cookie bảo mật.
   *
   * @param loginDto Email và mật khẩu người dùng nhập.
   * @param response Đối tượng HTTP response dùng để set cookie HttpOnly.
   * @returns Access token và thông tin người dùng an toàn để trả về client.
   * @throws UnauthorizedException Khi thông tin đăng nhập không hợp lệ.
   * @throws ForbiddenException Khi tài khoản chưa xác minh email.
   */
  async login(
    loginDto: LoginDto,
    response: Response,
  ): Promise<AuthTokenResponse> {
    const email = this.normalizeEmail(loginDto.email);
    const user = await this.usersService.findCredentialsByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    if (!user.is_verified) {
      throw new ForbiddenException('Tài khoản chưa xác minh email.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    await this.usersService.touchLastLogin(user.id);

    return this.createLoginResponse(user, response);
  }

  /**
   * Đồng bộ hồ sơ Google với tài khoản nội bộ và trả về user tối thiểu cho Passport.
   *
   * @param profile Hồ sơ Google đã có email từ provider.
   * @returns Người dùng đã được xác minh để hoàn tất callback OAuth.
   * @throws InternalServerErrorException Khi vai trò mặc định không thể tạo hoặc đọc.
   */
  async validateGoogleProfile(
    profile: GoogleUserProfile,
  ): Promise<AuthenticatedUser> {
    if (!this.isNonEmptyString(profile.email)) {
      throw new UnauthorizedException('Google không trả về email hợp lệ.');
    }

    const email = this.normalizeEmail(profile.email);
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      const user = existingUser.is_verified
        ? existingUser
        : await this.usersService.verifyGoogleUser(existingUser.id);

      return this.toAuthenticatedUser(user);
    }

    const fullName = profile.fullName || email.split('@')[0];
    const { firstName, lastName } = this.splitFullName(fullName);
    const passwordHash = await bcrypt.hash(randomUUID(), this.bcryptSaltRounds);

    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName: profile.firstName?.trim() || firstName,
      lastName: profile.lastName?.trim() || lastName,
      avatarUrl: profile.avatarUrl,
      roleName: AppRole.USER,
      isVerified: true,
    });

    return this.toAuthenticatedUser(user);
  }

  /**
   * Hoàn tất callback OAuth bằng cách phát hành token nội bộ giống luồng local login.
   *
   * @param request Request đã được GoogleStrategy gắn user.
   * @param response Đối tượng HTTP response dùng để set cookie HttpOnly.
   * @returns Access token và thông tin người dùng an toàn để trả về client.
   * @throws UnauthorizedException Khi user từ Passport không còn hợp lệ trong DB.
   */
  async completeGoogleLogin(
    request: AuthenticatedRequest,
    response: Response,
  ): Promise<AuthTokenResponse> {
    const user = await this.usersService.findById(request.user.id);

    if (!user || !user.is_verified) {
      throw new UnauthorizedException('Tài khoản Google không hợp lệ.');
    }

    await this.usersService.touchLastLogin(user.id);

    return this.createLoginResponse(user, response);
  }

  /**
   * Xác minh refresh token trong cookie, so sánh với hash Redis rồi xoay token mới.
   *
   * @param request Request chứa HttpOnly cookie do trình duyệt gửi lên.
   * @param response Đối tượng HTTP response dùng để set lại cookie sau khi rotate.
   * @returns Access token mới và thông tin người dùng.
   * @throws UnauthorizedException Khi refresh token thiếu, sai chữ ký, hết hạn hoặc không khớp hash Redis.
   */
  async refresh(
    request: RequestWithCookies,
    response: Response,
  ): Promise<AuthTokenResponse> {
    const refreshToken = this.extractRefreshTokenFromCookie(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    const payload = await this.verifyRefreshToken(refreshToken);
    const redisKey = AUTH_CONSTANTS.REDIS_KEYS.refreshToken(payload.sub);
    const storedHash = await this.getCacheValue<string>(redisKey);

    if (!this.isNonEmptyString(storedHash)) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    const isTokenMatched = await bcrypt.compare(refreshToken, storedHash);

    if (!isTokenMatched) {
      await this.deleteCacheValue(redisKey);
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.is_verified) {
      await this.deleteCacheValue(redisKey);
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    return this.createLoginResponse(user, response);
  }

  /**
   * Hủy phiên refresh token hiện tại bằng cách xóa hash Redis và clear cookie.
   *
   * @param user Người dùng đã được JwtAuthGuard xác thực.
   * @param response Đối tượng HTTP response dùng để clear cookie.
   * @returns Thông báo đăng xuất thành công.
   */
  async logout(
    user: AuthenticatedUser,
    response: Response,
  ): Promise<MessageResponse> {
    await this.deleteCacheValue(
      AUTH_CONSTANTS.REDIS_KEYS.refreshToken(user.id),
    );
    this.clearRefreshTokenCookie(response);

    return {
      message: 'Đăng xuất thành công.',
    };
  }

  private async createLoginResponse(
    user: UserRecordWithRole,
    response: Response,
  ): Promise<AuthTokenResponse> {
    const tokens = await this.issueTokens(user);

    this.setRefreshTokenCookie(response, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTokenTtlSeconds,
      user: this.toUserResponse(user),
    };
  }

  private async issueEmailVerificationOtp(userId: number): Promise<string> {
    const otp = randomInt(0, 1_000_000)
      .toString()
      .padStart(AUTH_CONSTANTS.OTP_LENGTH, '0');
    const otpHash = await bcrypt.hash(otp, this.bcryptSaltRounds);

    await this.setCacheValue(
      AUTH_CONSTANTS.REDIS_KEYS.verifyOtp(userId),
      otpHash,
      this.otpTtlMs,
    );

    return otp;
  }

  private async issueTokens(user: UserRecordWithRole): Promise<IssuedTokens> {
    const role = this.toAppRole(this.resolveUserRoleName(user));
    const basePayload = {
      sub: user.id,
      email: user.email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...basePayload,
          type: AuthTokenType.ACCESS,
          jti: randomUUID(),
        } satisfies JwtPayload,
        {
          secret: this.jwtSecret,
          expiresIn: this.accessTokenTtlSeconds,
        },
      ),
      this.jwtService.signAsync(
        {
          ...basePayload,
          type: AuthTokenType.REFRESH,
          jti: randomUUID(),
        } satisfies JwtPayload,
        {
          secret: this.refreshTokenSecret,
          expiresIn: this.refreshTokenTtlSeconds,
        },
      ),
    ]);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async storeRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const tokenHash = await bcrypt.hash(refreshToken, this.bcryptSaltRounds);

    await this.setCacheValue(
      AUTH_CONSTANTS.REDIS_KEYS.refreshToken(userId),
      tokenHash,
      this.refreshTokenTtlMs,
    );
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.refreshTokenSecret,
        },
      );

      if (payload.type !== AuthTokenType.REFRESH) {
        throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }
  }

  private async getCacheValue<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(
        `Không thể đọc cache key=${key}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể đọc dữ liệu phiên. Vui lòng thử lại sau.',
      );
    }
  }

  private async setCacheValue<T>(
    key: string,
    value: T,
    ttlMs: number,
  ): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlMs);
    } catch (error) {
      this.logger.error(
        `Không thể ghi cache key=${key}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể lưu dữ liệu phiên. Vui lòng thử lại sau.',
      );
    }
  }

  private async deleteCacheValue(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(
        `Không thể xóa cache key=${key}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể cập nhật dữ liệu phiên. Vui lòng thử lại sau.',
      );
    }
  }

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie(
      this.refreshTokenCookieName,
      refreshToken,
      this.refreshCookieOptions,
    );
  }

  private clearRefreshTokenCookie(response: Response): void {
    response.clearCookie(this.refreshTokenCookieName, this.clearCookieOptions);
  }

  private extractRefreshTokenFromCookie(
    request: RequestWithCookies,
  ): string | undefined {
    const refreshToken = request.cookies[this.refreshTokenCookieName] as
      | string
      | undefined;

    return this.isNonEmptyString(refreshToken)
      ? refreshToken.trim()
      : undefined;
  }

  private toAuthenticatedUser(user: UserRecordWithRole): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      role: this.toAppRole(this.resolveUserRoleName(user)),
    };
  }

  private toUserResponse(user: UserRecordWithRole): AuthUserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: [user.first_name, user.last_name].filter(Boolean).join(' '),
      role: this.toAppRole(this.resolveUserRoleName(user)),
      isVerified: user.is_verified,
    };
  }

  private resolveUserRoleName(user: UserRecordWithRole): string {
    const roleName = user.roles?.name;

    if (!this.isNonEmptyString(roleName)) {
      throw new InternalServerErrorException(
        'Vai trò người dùng không hợp lệ.',
      );
    }

    return roleName;
  }

  private toAppRole(roleName: string): AppRole {
    if (!this.isNonEmptyString(roleName)) {
      throw new InternalServerErrorException(
        'Vai trò người dùng không hợp lệ.',
      );
    }

    const normalizedRole = roleName.toUpperCase();

    if (Object.values(AppRole).includes(normalizedRole as AppRole)) {
      return normalizedRole as AppRole;
    }

    throw new InternalServerErrorException('Vai trò người dùng không hợp lệ.');
  }

  private splitFullName(fullName: string): {
    firstName: string;
    lastName: string;
  } {
    const normalizedFullName = fullName.trim().replace(/\s+/g, ' ');
    const [firstName = normalizedFullName, ...rest] =
      normalizedFullName.split(' ');

    return {
      firstName,
      lastName: rest.join(' '),
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private get jwtSecret(): string {
    return this.configService.getOrThrow<string>('jwt.secret');
  }

  private get refreshTokenSecret(): string {
    return this.configService.getOrThrow<string>('jwt.refreshSecret');
  }

  private get bcryptSaltRounds(): number {
    return this.configService.getOrThrow<number>('auth.bcryptSaltRounds');
  }

  private get otpTtlMs(): number {
    return this.configService.getOrThrow<number>('auth.otpTtlSeconds') * 1000;
  }

  private get accessTokenTtlSeconds(): number {
    return this.configService.getOrThrow<number>('jwt.accessTokenTtlSeconds');
  }

  private get refreshTokenTtlSeconds(): number {
    return this.configService.getOrThrow<number>('jwt.refreshTokenTtlSeconds');
  }

  private get refreshTokenTtlMs(): number {
    return this.refreshTokenTtlSeconds * 1000;
  }

  private get refreshTokenCookieName(): string {
    return this.configService.getOrThrow<string>('cookie.refreshTokenName');
  }

  private get refreshCookieOptions(): CookieOptions {
    return {
      ...this.cookieBaseOptions,
      maxAge: this.refreshTokenTtlMs,
    };
  }

  private get clearCookieOptions(): CookieOptions {
    return this.cookieBaseOptions;
  }

  private get cookieBaseOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.getOrThrow<boolean>('cookie.secure'),
      sameSite: 'strict',
      path: this.configService.getOrThrow<string>('cookie.path'),
    };
  }
}
