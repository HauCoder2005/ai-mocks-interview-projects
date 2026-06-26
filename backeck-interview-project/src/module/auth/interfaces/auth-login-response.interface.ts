import { ApiProperty } from '@nestjs/swagger';
import { UsersResponseDto } from 'src/module/users/dtos/users-response.dto';

export class AuthLoginResponse {
  @ApiProperty({
    example: 'access-token',
    description: 'JWT access token.',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'refresh-token',
    description: 'JWT refresh token.',
  })
  refreshToken!: string;

  @ApiProperty({
    example: 900,
    description: 'Thời gian hết hạn access token tính bằng giây.',
  })
  accessTokenExpiresIn!: number;

  @ApiProperty({
    example: 604800,
    description: 'Thời gian hết hạn refresh token tính bằng giây.',
  })
  refreshTokenExpiresIn!: number;

  @ApiProperty({
    type: () => UsersResponseDto,
    description: 'Thông tin người dùng đăng nhập.',
  })
  user!: UsersResponseDto;
}
