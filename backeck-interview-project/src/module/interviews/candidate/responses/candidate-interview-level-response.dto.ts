/*
 * Response DTO cho Interview Level ở phía Candidate.
 * Candidate dùng dữ liệu này để hiển thị danh sách Level khi cấu hình phỏng vấn.
 */
export class CandidateInterviewLevelResponseDto {
  id!: number;
  name!: string;
  code!: string;
  description!: string | null;
  displayOrder!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}