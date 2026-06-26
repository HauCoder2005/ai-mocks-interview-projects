import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'refresh-token',
    description: 'Refresh token dùng để cấp access token mới.',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
