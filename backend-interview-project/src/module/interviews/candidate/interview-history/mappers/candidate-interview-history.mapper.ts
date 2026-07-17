import { CandidateInterviewHistoryDetailResponse } from '../responses/candidate-interview-history-detail.response';
import { CandidateInterviewHistoryItemResponse } from '../responses/candidate-interview-history-item.response';

const decimal = (value: any): number | null =>
  value == null ? null : Number(value);

export class CandidateInterviewHistoryMapper {
  static toModel(record: any) {
    return record;
  }

  static toLifecycleResponse(record: any) {
    return {
      sessionId: record.id,
      configurationId: record.configuration_id,
      attemptNumber: record.attempt_number,
      status: record.status,
      startedAt: record.started_at,
      completedAt: record.completed_at,
      durationSeconds: record.duration_seconds,
      overallScore: decimal(record.overall_score),
      updatedAt: record.updated_at,
    };
  }

  static toActiveSessionResponse(record: any) {
    const configuration = record?.interview_configurations;
    const questions = Array.isArray(record?.interview_session_questions)
      ? record.interview_session_questions
      : [];
    return {
      sessionId: record.id,
      configurationId: record.configuration_id,
      status: record.status,
      attemptNumber: record.attempt_number,
      position: {
        id: configuration?.interview_positions?.id ?? 0,
        name: configuration?.interview_positions?.name ?? 'Chưa xác định',
      },
      level: {
        id: configuration?.interview_levels?.id ?? 0,
        name: configuration?.interview_levels?.name ?? 'Chưa xác định',
      },
      questionCount: configuration?.question_count ?? questions.length,
      answeredQuestionCount: questions.filter(
        (question: any) => question?.interview_answers?.length,
      ).length,
      createdAt: record.created_at,
      startedAt: record.started_at,
      canResume: true,
    };
  }

  static toResponseDto(record: any): CandidateInterviewHistoryItemResponse {
    const configuration = record?.interview_configurations ?? null;
    const position = configuration?.interview_positions ?? null;
    const level = configuration?.interview_levels ?? null;
    const questions = Array.isArray(record?.interview_session_questions)
      ? record.interview_session_questions
      : [];
    const technologies = Array.isArray(
      configuration?.interview_configuration_technologies,
    )
      ? configuration.interview_configuration_technologies
      : [];
    const topics = Array.isArray(configuration?.interview_configuration_topics)
      ? configuration.interview_configuration_topics
      : [];
    return {
      sessionId: record.id,
      configurationId: record.configuration_id,
      title: configuration?.name ?? 'Phiên phỏng vấn AI',
      attemptNumber: record.attempt_number,
      status: record.status,
      position: {
        id: position?.id ?? 0,
        name: position?.name ?? 'Chưa xác định',
      },
      level: {
        id: level?.id ?? 0,
        name: level?.name ?? 'Chưa xác định',
      },
      interviewType: configuration?.interview_type ?? 'MIXED',
      questionCount: configuration?.question_count ?? questions.length,
      answeredQuestionCount: questions.filter(
        (question: any) => question.interview_answers?.length,
      ).length,
      durationMinutes: configuration?.duration_minutes ?? 0,
      durationSeconds: record.duration_seconds,
      overallScore: decimal(record.overall_score),
      technologies: technologies.flatMap((item: any) => {
        const technology = item?.interview_technologies;
        return technology
          ? [
              {
                id: technology.id,
                name: technology.name,
                slug: technology.slug,
              },
            ]
          : [];
      }),
      topics: topics.flatMap((item: any) => {
        const topic = item?.interview_topics;
        return topic ? [{ id: topic.id, name: topic.name }] : [];
      }),
      startedAt: record.started_at,
      completedAt: record.completed_at,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  static toDetailResponseDto(
    record: any,
  ): CandidateInterviewHistoryDetailResponse {
    const item = this.toResponseDto(record);
    const report = record.interview_reports;
    return {
      ...item,
      questions: (record.interview_session_questions ?? []).map(
        (question: any) => {
          const answer = question.interview_answers?.[0] ?? null;
          const review = answer?.interview_answer_reviews?.[0] ?? null;
          return {
            sessionQuestionId: question.id,
            displayOrder: question.display_order,
            content: question.content,
            questionType: question.question_type,
            difficulty: question.difficulty,
            answered: Boolean(answer),
            answer: answer
              ? {
                  answerText: answer.answer_text,
                  sourceCode: answer.source_code,
                  selectedOptionId: answer.selected_option_id,
                  submittedAt: answer.submitted_at,
                }
              : null,
            review: review
              ? {
                  score: decimal(review.score),
                  feedback: review.feedback,
                  strengths: review.strengths,
                  weaknesses: review.weaknesses,
                  suggestions: review.suggestions,
                }
              : null,
          };
        },
      ),
      report: report
        ? {
            overallScore: decimal(report.overall_score),
            technicalScore: decimal(report.technical_score),
            problemSolvingScore: decimal(report.problem_solving_score),
            communicationScore: decimal(report.communication_score),
            strengths: report.strengths,
            weaknesses: report.weaknesses,
            recommendations: report.recommendations,
            learningPath: report.learning_path,
            readinessLevel: report.readiness_level,
          }
        : null,
    };
  }
}
