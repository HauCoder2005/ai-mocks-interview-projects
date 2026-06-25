export class AdminInterviewPositionResponseDto {
  id!: number;
  name!: string;
  code!: string;
  description!: string | null;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}