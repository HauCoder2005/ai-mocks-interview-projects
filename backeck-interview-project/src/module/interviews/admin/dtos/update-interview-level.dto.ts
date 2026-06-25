import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateInterviewLevelDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  displayOrder?: number;
}