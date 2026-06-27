import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'candidate@example.com',
    description: 'Email đăng nhập.',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description: 'Mật khẩu đăng nhập.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  password!: string;
}
