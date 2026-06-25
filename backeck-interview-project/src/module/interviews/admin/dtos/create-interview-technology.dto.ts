import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/*
 * DTO nhận dữ liệu khi Admin tạo mới Interview Technology.
 * Technology là công nghệ để Candidate chọn khi cấu hình buổi phỏng vấn.
 */
export class CreateInterviewTechnologyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;
}