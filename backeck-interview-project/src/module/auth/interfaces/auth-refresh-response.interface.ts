import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshResponse {
  @ApiProperty({
    example: 'access-token',
    description: 'JWT access token mới.',
  })
  accessToken!: string;

  @ApiProperty({
    example: 900,
    description: 'Thời gian hết hạn access token tính bằng giây.',
  })
  accessTokenExpiresIn!: number;
}
