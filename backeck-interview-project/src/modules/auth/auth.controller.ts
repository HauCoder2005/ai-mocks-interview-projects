import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../shared/guards';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type {
  AuthenticatedRequest,
  RequestWithCookies,
} from './interfaces/auth-request.interface';
import type {
  AuthTokenResponse,
  MessageResponse,
} from './interfaces/auth-response.interface';

/**
 * Controller HTTP cho các luồng xác thực.
 *
 * Controller chỉ nhận request, chuyển dữ liệu đã validate xuống AuthService và
 * trả response. Toàn bộ nghiệp vụ xác thực nằm trong service để giữ lớp HTTP mỏng.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Tạo tài khoản local và phát hành OTP xác minh email.
   *
   * @param registerDto Dữ liệu đăng ký từ client.
   * @returns Thông báo đăng ký thành công.
   */
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản local',
    description:
      'Tạo user chưa xác minh, hash mật khẩu và phát hành OTP xác minh email qua Redis.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đăng ký thành công và OTP đã được tạo.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email đã tồn tại trong hệ thống.',
  })
  register(@Body() registerDto: RegisterDto): Promise<MessageResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * Xác minh email bằng OTP đã được lưu trong Redis.
   *
   * @param verifyEmailDto Email và OTP người dùng gửi lên.
   * @returns Thông báo xác minh thành công.
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác minh email bằng OTP',
    description:
      'So sánh OTP với hash trong Redis, kích hoạt tài khoản và xóa OTP sau khi xác minh.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email đã được xác minh thành công.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'OTP không hợp lệ, đã hết hạn hoặc tài khoản đã xác minh.',
  })
  verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<MessageResponse> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * Đăng nhập local và gắn refresh token vào HttpOnly cookie.
   *
   * @param loginDto Email và mật khẩu từ client.
   * @param response Response dùng để set cookie bảo mật.
   * @returns Access token và thông tin người dùng.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập local',
    description:
      'Xác thực email và mật khẩu, trả access token qua JSON và đặt refresh token vào HttpOnly Cookie.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Tài khoản chưa xác minh email.',
  })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokenResponse> {
    return this.authService.login(loginDto, response);
  }

  /**
   * Khởi động luồng Google OAuth qua guard Passport.
   *
   * @returns Không trả body vì guard sẽ xử lý redirect.
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Bắt đầu đăng nhập Google OAuth 2.0',
    description: 'Chuyển hướng người dùng sang Google để xác thực OAuth.',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Chuyển hướng đến Google OAuth consent screen.',
  })
  google(): undefined {
    return undefined;
  }

  /**
   * Hoàn tất callback Google OAuth và phát hành token nội bộ.
   *
   * @param request Request đã được guard gắn user Google đã xác thực.
   * @param response Response dùng để set cookie bảo mật.
   * @returns Access token và thông tin người dùng.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Callback Google OAuth 2.0',
    description:
      'Đồng bộ tài khoản Google, tự động đăng ký nếu cần và phát hành token nội bộ.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập Google thành công.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Google không trả về email hợp lệ hoặc tài khoản không hợp lệ.',
  })
  googleCallback(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokenResponse> {
    return this.authService.completeGoogleLogin(request, response);
  }

  /**
   * Làm mới access token bằng refresh token trong cookie.
   *
   * @param request Request chứa HttpOnly cookie.
   * @param response Response dùng để rotate refresh token cookie.
   * @returns Access token mới và thông tin người dùng.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới access token',
    description:
      'Đọc refresh token từ HttpOnly Cookie, so sánh hash trong Redis và rotate refresh token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token hợp lệ và access token mới đã được cấp.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token thiếu, hết hạn hoặc không khớp phiên Redis.',
  })
  refresh(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokenResponse> {
    return this.authService.refresh(request, response);
  }

  /**
   * Đăng xuất phiên hiện tại bằng cách xóa refresh token và clear cookie.
   *
   * @param request Request đã có user từ JwtAuthGuard.
   * @param response Response dùng để clear cookie.
   * @returns Thông báo đăng xuất thành công.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Đăng xuất',
    description:
      'Xóa refresh token hash khỏi Redis và clear HttpOnly Cookie của phiên hiện tại.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng xuất thành công.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token không hợp lệ hoặc đã hết hạn.',
  })
  logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MessageResponse> {
    return this.authService.logout(request.user, response);
  }
}
