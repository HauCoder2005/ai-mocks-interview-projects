import { interview_technologies } from 'generated/prisma/client';

import { AdminInterviewTechnologyModel } from '../models/admin-interview-technology.model';
import { AdminInterviewTechnologyResponseDto } from '../responses/admin-interview-technology-response.dto';

export class AdminInterviewTechnologyMapper {
  /*
   * Chuyển dữ liệu interview_technologies từ Prisma sang AdminInterviewTechnologyModel.
   */
  static toModel(
    technology: interview_technologies,
  ): AdminInterviewTechnologyModel {
    return new AdminInterviewTechnologyModel({
      id: technology.id,
      name: technology.name,
      slug: technology.slug,
      code: technology.code,
      description: technology.description,
      isActive: technology.is_active,
      createdAt: technology.created_at,
      updatedAt: technology.updated_at,
    });
  }

  /*
   * Chuyển AdminInterviewTechnologyModel sang AdminInterviewTechnologyResponseDto để trả về API.
   */
  static toResponseDto(
    technology: AdminInterviewTechnologyModel,
  ): AdminInterviewTechnologyResponseDto {
    return {
      id: technology.id,
      name: technology.name,
      slug: technology.slug,
      code: technology.code,
      description: technology.description,
      isActive: technology.isActive,
      createdAt: technology.createdAt,
      updatedAt: technology.updatedAt,
    };
  }
}
