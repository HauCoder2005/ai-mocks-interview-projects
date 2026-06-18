import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchField } from '../../../shared/validators';
import { normalizeEmail, trimString } from './transformers';

export class RegisterDto {
  @ApiProperty({
    description: 'Email dùng làm định danh đăng nhập duy nhất.',
    example: 'candidate@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(normalizeEmail)
  email!: string;

  @ApiProperty({
    description:
      'Mật khẩu mạnh gồm chữ thường, chữ hoa, chữ số và ký tự đặc biệt.',
    example: 'Str0ngP@ssword',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message: 'Mật khẩu phải có chữ thường, chữ hoa, chữ số và ký tự đặc biệt.',
  })
  password!: string;

  @ApiProperty({
    description: 'Mật khẩu xác nhận phải trùng với mật khẩu chính.',
    example: 'Str0ngP@ssword',
  })
  @IsString()
  @MatchField('password', {
    message: 'Mật khẩu xác nhận phải trùng với mật khẩu.',
  })
  confirmPassword!: string;

  @ApiProperty({
    description: 'Họ tên đầy đủ của ứng viên hoặc người dùng mới.',
    example: 'Nguyễn Văn An',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(trimString)
  fullName!: string;
}
