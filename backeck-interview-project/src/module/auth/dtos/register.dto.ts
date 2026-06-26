import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'An',
    description: 'Tên của người dùng.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({
    example: 'Nguyen',
    description: 'Họ của người dùng.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({
    example: 'candidate@example.com',
    description: 'Email đăng ký tài khoản.',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description: 'Mật khẩu tài khoản.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(72)
  password!: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại người dùng.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string;
}
