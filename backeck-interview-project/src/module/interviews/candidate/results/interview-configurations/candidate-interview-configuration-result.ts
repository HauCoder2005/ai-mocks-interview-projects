import {
  interview_configurations_interview_type,
  interview_levels,
  interview_positions,
  interview_technologies,
  interview_topics,
} from 'generated/prisma/client';

export interface CandidateInterviewConfigurationRecord {
  id: number;
  user_id: number;
  position_id: number;
  level_id: number;
  name: string;
  interview_type: interview_configurations_interview_type;
  question_count: number;
  duration_minutes: number;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  interview_positions: interview_positions;
  interview_levels: interview_levels;
  interview_configuration_technologies: {
    interview_technologies: interview_technologies;
  }[];
  interview_configuration_topics: {
    interview_topics: interview_topics;
  }[];
}

/*
 * Đại diện cho kết quả Repository trả về sau khi tạo Interview Configuration.
 * Record đã include đủ Position, Level, Technologies và Topics để Mapper xử lý.
 */
export interface CandidateInterviewConfigurationResult {
  configuration: CandidateInterviewConfigurationRecord;
}
