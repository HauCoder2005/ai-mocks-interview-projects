/*
 * Response DTO cho Interview Technology ở phía Admin.
 * Admin dùng dữ liệu này để quản lý master data Technology.
 */
export class AdminInterviewTechnologyResponseDto {
  id!: number;
  name!: string;
  slug!: string;
  code!: string;
  description!: string | null;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}