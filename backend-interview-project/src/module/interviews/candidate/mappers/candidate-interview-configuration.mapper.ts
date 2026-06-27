import { CandidateInterviewConfigurationModel } from '../models/candidate-interview-configuration.model';
import { CandidateInterviewConfigurationResponseDto } from '../responses/candidate-interview-configuration-response.dto';
import { CandidateInterviewConfigurationRecord } from '../results/interview-configurations/candidate-interview-configuration-result';

export class CandidateInterviewConfigurationMapper {
  /*
   * Chuyển dữ liệu Interview Configuration từ Prisma sang domain model.
   */
  static toModel(
    configuration: CandidateInterviewConfigurationRecord,
  ): CandidateInterviewConfigurationModel {
    return new CandidateInterviewConfigurationModel({
      id: configuration.id,
      userId: configuration.user_id,
      name: configuration.name,
      interviewType: configuration.interview_type,
      questionCount: configuration.question_count,
      durationMinutes: configuration.duration_minutes,
      description: configuration.description,
      position: {
        id: configuration.interview_positions.id,
        name: configuration.interview_positions.name,
        code: configuration.interview_positions.code,
        description: configuration.interview_positions.description,
      },
      level: {
        id: configuration.interview_levels.id,
        name: configuration.interview_levels.name,
        code: configuration.interview_levels.code,
        description: configuration.interview_levels.description,
        displayOrder: configuration.interview_levels.display_order,
      },
      technologies: configuration.interview_configuration_technologies.map(
        (item) => ({
          id: item.interview_technologies.id,
          name: item.interview_technologies.name,
          slug: item.interview_technologies.slug,
          code: item.interview_technologies.code,
          description: item.interview_technologies.description,
        }),
      ),
      topics: configuration.interview_configuration_topics.map((item) => ({
        id: item.interview_topics.id,
        name: item.interview_topics.name,
        code: item.interview_topics.code,
        description: item.interview_topics.description,
      })),
      createdAt: configuration.created_at,
      updatedAt: configuration.updated_at,
    });
  }

  /*
   * Chuyển CandidateInterviewConfigurationModel sang Response DTO để trả về API.
   */
  static toResponseDto(
    configuration: CandidateInterviewConfigurationModel,
  ): CandidateInterviewConfigurationResponseDto {
    return {
      id: configuration.id,
      userId: configuration.userId,
      name: configuration.name,
      interviewType: configuration.interviewType,
      questionCount: configuration.questionCount,
      durationMinutes: configuration.durationMinutes,
      description: configuration.description,
      position: configuration.position,
      level: configuration.level,
      technologies: configuration.technologies,
      topics: configuration.topics,
      createdAt: configuration.createdAt,
      updatedAt: configuration.updatedAt,
    };
  }
}
