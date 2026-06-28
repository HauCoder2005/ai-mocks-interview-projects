import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/responses/api-response.interface';
import {
  ApiBadRequestErrorResponse,
  ApiConflictErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiFormBody } from 'src/shared/swagger/decorators/api-form-body.decorator';
import {
  ApiCreatedSuccessResponse,
  ApiSuccessResponse,
} from 'src/shared/swagger/decorators/api-success-response.decorator';

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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /*
   * Inject AuthService để controller chỉ điều phối request và response.
   */
  constructor(private readonly authService: AuthService) {}

  /*
   * Endpoint đăng ký tài khoản bằng email/password.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiFormBody(RegisterDto)
  @ApiCreatedSuccessResponse(UsersResponseDto, 'Register successfully')
  @ApiBadRequestErrorResponse()
  @ApiConflictErrorResponse('Email already exists')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiResponse<UsersResponseDto>> {
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Register successfully',
      data: await this.authService.register(dto),
    };
  }

  /*
   * Endpoint đăng nhập bằng email/password.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập bằng email/password' })
  @ApiFormBody(LoginDto)
  @ApiSuccessResponse(AuthLoginResponse, 'Login successfully')
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse('Invalid credentials')
  async login(@Body() dto: LoginDto): Promise<ApiResponse<AuthLoginResponse>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      data: await this.authService.login(dto),
    };
  }

  /*
   * Endpoint cấp access token mới từ refresh token.
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cấp access token mới' })
  @ApiFormBody(RefreshTokenDto)
  @ApiSuccessResponse(AuthRefreshResponse, 'Refresh token successfully')
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse('Invalid refresh token')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<ApiResponse<AuthRefreshResponse>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Refresh token successfully',
      data: await this.authService.refreshToken(dto),
    };
  }

  /*
   * Endpoint logout bằng cách revoke refresh session.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout và revoke refresh session' })
  @ApiFormBody(LogoutDto)
  @ApiSuccessResponse(null, 'Logout successfully')
  @ApiBadRequestErrorResponse()
  async logout(@Body() dto: LogoutDto): Promise<ApiResponse<null>> {
    await this.authService.logout(dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Logout successfully',
      data: null,
    };
  }

  /*
   * Endpoint gửi lại OTP xác thực tài khoản.
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi lại OTP xác thực tài khoản' })
  @ApiFormBody(ForgotPasswordDto)
  @ApiSuccessResponse(null, 'If the email is valid, an OTP has been sent')
  @ApiBadRequestErrorResponse()
  async sendAccountVerificationOtp(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.sendAccountVerificationOtp(dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'If the email is valid, an OTP has been sent',
      data: null,
    };
  }

  /*
   * Endpoint xác thực tài khoản bằng OTP.
   */
  @Post('verify-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác thực tài khoản bằng OTP' })
  @ApiFormBody(VerifyAccountDto)
  @ApiSuccessResponse(UsersResponseDto, 'Account verified successfully')
  @ApiBadRequestErrorResponse()
  async verifyAccount(
    @Body() dto: VerifyAccountDto,
  ): Promise<ApiResponse<UsersResponseDto>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Account verified successfully',
      data: await this.authService.verifyAccount(dto),
    };
  }

  /*
   * Endpoint gửi OTP quên mật khẩu.
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi OTP quên mật khẩu' })
  @ApiFormBody(ForgotPasswordDto)
  @ApiSuccessResponse(null, 'If the email is valid, an OTP has been sent')
  @ApiBadRequestErrorResponse()
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.forgotPassword(dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'If the email is valid, an OTP has been sent',
      data: null,
    };
  }

  /*
   * Endpoint reset mật khẩu bằng OTP.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset mật khẩu bằng OTP' })
  @ApiFormBody(ResetPasswordDto)
  @ApiSuccessResponse(null, 'Password reset successfully')
  @ApiBadRequestErrorResponse()
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.resetPassword(dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
      data: null,
    };
  }

  /*
   * Endpoint đăng nhập nhanh bằng Google idToken.
   */
  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập bằng Google idToken' })
  @ApiFormBody(GoogleLoginDto)
  @ApiSuccessResponse(AuthLoginResponse, 'Login successfully')
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse('Invalid Google token')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
  ): Promise<ApiResponse<AuthLoginResponse>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      data: await this.authService.googleLogin(dto),
    };
  }
}
