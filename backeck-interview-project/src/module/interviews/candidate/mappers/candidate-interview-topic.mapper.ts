import { interview_topics } from 'generated/prisma/client';

import { CandidateInterviewTopicModel } from '../models/candidate-interview-topic.model';
import { CandidateInterviewTopicResponseDto } from '../responses/candidate-interview-topic-response.dto';

export class CandidateInterviewTopicMapper {
  /*
   * Chuyển dữ liệu interview_topics từ Prisma sang CandidateInterviewTopicModel.
   * Candidate chỉ đọc dữ liệu Topic, không được chỉnh sửa master data.
   */
  static toModel(topic: interview_topics): CandidateInterviewTopicModel {
    return new CandidateInterviewTopicModel({
      id: topic.id,
      name: topic.name,
      code: topic.code,
      description: topic.description,
      isActive: topic.is_active,
      createdAt: topic.created_at,
      updatedAt: topic.updated_at,
    });
  }

  /*
   * Chuyển CandidateInterviewTopicModel sang Response DTO để trả về API.
   */
  static toResponseDto(
    topic: CandidateInterviewTopicModel,
  ): CandidateInterviewTopicResponseDto {
    return {
      id: topic.id,
      name: topic.name,
      code: topic.code,
      description: topic.description,
      isActive: topic.isActive,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };
  }
}
