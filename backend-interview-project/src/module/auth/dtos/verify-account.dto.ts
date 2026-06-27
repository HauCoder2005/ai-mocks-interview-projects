import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty({
    example: 'candidate@example.com',
    description: 'Email cần xác thực tài khoản.',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã OTP 6 chữ số.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'otpCode must be a 6-digit code',
  })
  otpCode!: string;
}
