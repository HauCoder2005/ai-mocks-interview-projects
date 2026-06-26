import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsersResponseDto {
  @ApiProperty({ example: 1, description: 'ID người dùng.' })
  id!: number;

  @ApiProperty({ example: 2, description: 'ID role của người dùng.' })
  roleId!: number;

  @ApiProperty({
    example: 'candidate@example.com',
    description: 'Email người dùng.',
  })
  email!: string;

  @ApiProperty({ example: 'An', description: 'Tên người dùng.' })
  firstName!: string;

  @ApiProperty({ example: 'Nguyen', description: 'Họ người dùng.' })
  lastName!: string;

  @ApiProperty({ example: 'An Nguyen', description: 'Họ tên đầy đủ.' })
  fullName!: string;

  @ApiProperty({ example: '0901234567', description: 'Số điện thoại.' })
  phoneNumber!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    nullable: true,
    description: 'URL avatar.',
  })
  avatarUrl!: string | null;

  @ApiProperty({
    example: 'Backend Developer',
    description: 'Headline của người dùng.',
  })
  headline!: string;

  @ApiProperty({
    example: 'Backend Developer',
    description: 'Vị trí hiện tại.',
  })
  currentPosition!: string;

  @ApiProperty({ example: 3, description: 'Số năm kinh nghiệm.' })
  yearsOfExperience!: number;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/example',
    nullable: true,
    description: 'LinkedIn URL.',
  })
  linkedinUrl!: string | null;

  @ApiPropertyOptional({
    example: 'https://github.com/example',
    nullable: true,
    description: 'GitHub URL.',
  })
  githubUrl!: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com',
    nullable: true,
    description: 'Portfolio URL.',
  })
  portfolioUrl!: string | null;

  @ApiProperty({ example: true, description: 'Trạng thái xác thực email.' })
  isVerified!: boolean;

  @ApiPropertyOptional({
    example: '2026-06-26T00:00:00.000Z',
    nullable: true,
    description: 'Thời điểm đăng nhập gần nhất.',
  })
  lastLoginAt!: Date | null;

  @ApiProperty({
    example: '2026-06-26T00:00:00.000Z',
    description: 'Thời điểm tạo user.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-26T00:00:00.000Z',
    description: 'Thời điểm cập nhật user.',
  })
  updatedAt!: Date;
}
