import { interview_levels } from 'generated/prisma/client';
import { AdminInterviewLevelModel } from '../models/admin-interview-level.model';
import { AdminInterviewLevelResponseDto } from '../responses/admin-interview-level-response.dto';

export class AdminInterviewLevelMapper {
  /*
   * Chuyển dữ liệu interview_levels từ Prisma sang AdminInterviewLevelModel.
   */
  static toModel(level: interview_levels): AdminInterviewLevelModel {
    return new AdminInterviewLevelModel({
      id: level.id,
      name: level.name,
      code: level.code,
      description: level.description,
      displayOrder: level.display_order,
      isActive: level.is_active,
      createdAt: level.created_at,
      updatedAt: level.updated_at,
    });
  }

  /*
   * Chuyển AdminInterviewLevelModel sang AdminInterviewLevelResponseDto để trả về API.
   */
  static toResponseDto(
    level: AdminInterviewLevelModel,
  ): AdminInterviewLevelResponseDto {
    return {
      id: level.id,
      name: level.name,
      code: level.code,
      description: level.description,
      displayOrder: level.displayOrder,
      isActive: level.isActive,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    };
  }
}
