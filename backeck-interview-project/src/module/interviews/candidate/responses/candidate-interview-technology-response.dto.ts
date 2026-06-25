/*
 * Response DTO cho Interview Technology ở phía Candidate.
 * Candidate dùng dữ liệu này để hiển thị danh sách Technology khi cấu hình phỏng vấn.
 */
export class CandidateInterviewTechnologyResponseDto {
  id!: number;
  name!: string;
  slug!: string;
  code!: string;
  description!: string | null;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}