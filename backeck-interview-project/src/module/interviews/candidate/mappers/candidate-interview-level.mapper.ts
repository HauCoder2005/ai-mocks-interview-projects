import { interview_levels } from 'generated/prisma/client';
import { CandidateInterviewLevelModel } from '../models/candidate-interview-level.model';
import { CandidateInterviewLevelResponseDto } from '../responses/candidate-interview-level-response.dto';

export class CandidateInterviewLevelMapper {
  /*
   * Chuyển dữ liệu interview_levels từ Prisma sang CandidateInterviewLevelModel.
   */
  static toModel(level: interview_levels): CandidateInterviewLevelModel {
    return new CandidateInterviewLevelModel({
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
   * Chuyển CandidateInterviewLevelModel sang CandidateInterviewLevelResponseDto để trả về API.
   */
  static toResponseDto(
    level: CandidateInterviewLevelModel,
  ): CandidateInterviewLevelResponseDto {
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
