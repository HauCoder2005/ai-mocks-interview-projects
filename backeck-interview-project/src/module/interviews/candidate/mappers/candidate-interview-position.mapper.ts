import { interview_positions } from 'generated/prisma/client';

import { CandidateInterviewPositionModel } from '../models/candidate-interview-position.model';
import { CandidateInterviewPositionResponseDto } from '../responses/candidate-interview-position-response.dto';

export class CandidateInterviewPositionMapper {
  static toModel(
    position: interview_positions,
  ): CandidateInterviewPositionModel {
    return new CandidateInterviewPositionModel({
      id: position.id,
      name: position.name,
      code: position.code,
      description: position.description,
      isActive: position.is_active,
      createdAt: position.created_at,
      updatedAt: position.updated_at,
    });
  }

  static toResponseDto(
    position: CandidateInterviewPositionModel,
  ): CandidateInterviewPositionResponseDto {
    return {
      id: position.id,
      name: position.name,
      code: position.code,
      description: position.description,
      isActive: position.isActive,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    };
  }
}