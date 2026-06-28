import { interview_positions } from 'generated/prisma/client';
import { AdminInterviewPositionModel } from '../models/admin-interview-position.model';
import { AdminInterviewPositionResponseDto } from '../responses/admin-interview-position-response.dto';

export class AdminInterviewPositionMapper {
  static toModel(position: interview_positions): AdminInterviewPositionModel {
    return new AdminInterviewPositionModel({
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
    position: AdminInterviewPositionModel,
  ): AdminInterviewPositionResponseDto {
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