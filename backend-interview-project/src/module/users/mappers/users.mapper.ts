import { users } from 'generated/prisma/client';
import { UsersResponseDto } from '../dtos/users-response.dto';
import { UserModel } from '../models/users.model';

export class UserMapper {
  static toModel(user: users): UserModel {
    return new UserModel({
      id: user.id,
      roleId: user.role_id,
      email: user.email,
      passwordHash: user.password_hash,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      avatarUrl: user.avatar_url,
      headline: user.headline,
      currentPosition: user.current_position,
      yearsOfExperience: user.years_of_experience,
      linkedinUrl: user.linkedin_url,
      githubUrl: user.github_url,
      portfolioUrl: user.portfolio_url,
      isVerified: user.is_verified,
      lastLoginAt: user.last_login_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  }

  static toResponseDto(user: UserModel): UsersResponseDto {
    return {
      id: user.id,
      roleId: user.roleId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      headline: user.headline,
      currentPosition: user.currentPosition,
      yearsOfExperience: user.yearsOfExperience,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
