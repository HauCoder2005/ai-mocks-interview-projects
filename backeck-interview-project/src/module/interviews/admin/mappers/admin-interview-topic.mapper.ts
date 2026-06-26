import { interview_topics } from 'generated/prisma/client';

import { AdminInterviewTopicModel } from '../models/admin-interview-topic.model';
import { AdminInterviewTopicResponseDto } from '../responses/admin-interview-topic-response.dto';

export class AdminInterviewTopicMapper {
  /*
   * Chuyển dữ liệu interview_topics từ Prisma sang AdminInterviewTopicModel.
   */
  static toModel(topic: interview_topics): AdminInterviewTopicModel {
    return new AdminInterviewTopicModel({
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
   * Chuyển AdminInterviewTopicModel sang AdminInterviewTopicResponseDto để trả về API.
   */
  static toResponseDto(
    topic: AdminInterviewTopicModel,
  ): AdminInterviewTopicResponseDto {
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
