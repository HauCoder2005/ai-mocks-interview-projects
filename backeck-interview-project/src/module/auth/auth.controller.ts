import { Body, Controller, Post } from '@nestjs/common';

import { ApiResponse } from 'src/shared/responses/api-response.interface';

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
import { AuthService } from './auth.service';
import { UsersResponseDto } from '../users/dtos/users-response.dto';

@Controller('auth')
export class AuthController {
  /**
   * Inject AuthService để controller chỉ điều phối request/response.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint đăng ký tài khoản bằng email/password.
   */
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiResponse<UsersResponseDto>> {
    return {
      message: 'Register successfully',
      data: await this.authService.register(dto),
    };
  }

  /**
   * Endpoint đăng nhập bằng email/password.
   */
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ApiResponse<AuthLoginResponse>> {
    return {
      message: 'Login successfully',
      data: await this.authService.login(dto),
    };
  }

  /**
   * Endpoint cấp access token mới từ refresh token.
   */
  @Post('refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<ApiResponse<AuthRefreshResponse>> {
    return {
      message: 'Refresh token successfully',
      data: await this.authService.refreshToken(dto),
    };
  }

  /**
   * Endpoint logout bằng cách revoke refresh session.
   */
  @Post('logout')
  async logout(@Body() dto: LogoutDto): Promise<ApiResponse<null>> {
    await this.authService.logout(dto);

    return {
      message: 'Logout successfully',
      data: null,
    };
  }

  /**
   * Endpoint gửi lại OTP xác thực tài khoản.
   */
  @Post('resend-otp')
  async sendAccountVerificationOtp(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.sendAccountVerificationOtp(dto);

    return {
      message: 'If the email is valid, an OTP has been sent',
      data: null,
    };
  }

  /**
   * Endpoint xác thực tài khoản bằng OTP.
   */
  @Post('verify-account')
  async verifyAccount(
    @Body() dto: VerifyAccountDto,
  ): Promise<ApiResponse<UsersResponseDto>> {
    return {
      message: 'Account verified successfully',
      data: await this.authService.verifyAccount(dto),
    };
  }

  /**
   * Endpoint gửi OTP quên mật khẩu.
   */
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.forgotPassword(dto);

    return {
      message: 'If the email is valid, an OTP has been sent',
      data: null,
    };
  }

  /**
   * Endpoint reset mật khẩu bằng OTP.
   */
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.resetPassword(dto);

    return {
      message: 'Password reset successfully',
      data: null,
    };
  }

  /**
   * Endpoint đăng nhập nhanh bằng Google idToken.
   */
  @Post('google-login')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
  ): Promise<ApiResponse<AuthLoginResponse>> {
    return {
      message: 'Login successfully',
      data: await this.authService.googleLogin(dto),
    };
  }
}
