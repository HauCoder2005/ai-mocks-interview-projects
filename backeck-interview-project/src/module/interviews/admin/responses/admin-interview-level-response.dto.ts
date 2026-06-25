export class AdminInterviewLevelResponseDto {
  id!: number;
  name!: string;
  code!: string;
  description!: string | null;
  displayOrder!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}