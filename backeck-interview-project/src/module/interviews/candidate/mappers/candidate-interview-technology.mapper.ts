import { interview_technologies } from 'generated/prisma/client';

import { CandidateInterviewTechnologyModel } from '../models/candidate-interview-technology.model';
import { CandidateInterviewTechnologyResponseDto } from '../responses/candidate-interview-technology-response.dto';

export class CandidateInterviewTechnologyMapper {
  /*
   * Chuyển dữ liệu interview_technologies từ Prisma sang CandidateInterviewTechnologyModel.
   * Candidate chỉ đọc dữ liệu Technology, không được chỉnh sửa master data.
   */
  static toModel(
    technology: interview_technologies,
  ): CandidateInterviewTechnologyModel {
    return new CandidateInterviewTechnologyModel({
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
   * Chuyển CandidateInterviewTechnologyModel sang Response DTO để trả về API.
   */
  static toResponseDto(
    technology: CandidateInterviewTechnologyModel,
  ): CandidateInterviewTechnologyResponseDto {
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
