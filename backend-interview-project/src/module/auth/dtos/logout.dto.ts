import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    example: 'refresh-token',
    description: 'Refresh token cần revoke.',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
