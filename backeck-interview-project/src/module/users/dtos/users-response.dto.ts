export class UsersResponseDto {
  id!: number;
  roleId!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  phoneNumber!: string;
  avatarUrl!: string | null;
  headline!: string;
  currentPosition!: string;
  yearsOfExperience!: number;
  linkedinUrl!: string | null;
  githubUrl!: string | null;
  portfolioUrl!: string | null;
  isVerified!: boolean;
  lastLoginAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
