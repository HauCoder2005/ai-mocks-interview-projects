import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeEmail } from './transformers';

export class LoginDto {
  @ApiProperty({
    description: 'Email dùng để đăng nhập tài khoản local.',
    example: 'candidate@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(normalizeEmail)
  email!: string;

  @ApiProperty({
    description: 'Mật khẩu tài khoản local.',
    example: 'Str0ngP@ssword',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
