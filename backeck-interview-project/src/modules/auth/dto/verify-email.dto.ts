import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, Matches, MaxLength } from 'class-validator';
import { normalizeEmail } from './transformers';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email của tài khoản đang cần xác minh.',
    example: 'candidate@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(normalizeEmail)
  email!: string;

  @ApiProperty({
    description: 'Mã OTP gồm 6 chữ số được cấp khi đăng ký.',
    example: '123456',
    pattern: '^\\d{6}$',
  })
  @Matches(/^\d{6}$/, {
    message: 'OTP phải gồm đúng 6 chữ số.',
  })
  otp!: string;
}
