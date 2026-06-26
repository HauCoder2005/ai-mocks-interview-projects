import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    example: 'google-id-token',
    description: 'Google ID token do frontend gửi lên.',
  })
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
