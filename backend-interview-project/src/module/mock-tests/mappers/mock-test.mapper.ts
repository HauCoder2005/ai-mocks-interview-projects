import { TestAttemptStatus } from 'generated/prisma/client';

export class MockTestMapper {
  static toListItem(record: any) {
    return {
      id: record.id,
      title: record.title,
      slug: record.slug,
      description: record.description,
      coverImageUrl: record.cover_image_url,
      durationMinutes: record.duration_minutes,
      totalQuestions: record.total_questions,
      status: record.status,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  static toDetail(record: any, includeCorrectAnswers = false) {
    return {
      ...this.toListItem(record),
      questions: (record.questions ?? []).map((item: any) =>
        this.toQuestion(item, includeCorrectAnswers),
      ),
    };
  }

  static toAttempt(record: any) {
    return {
      id: record.id,
      mockTestId: record.mock_test_id,
      status: record.status,
      totalQuestions: record.total_questions,
      correctAnswers: record.correct_answers,
      score: record.score === null ? null : Number(record.score),
      startedAt: record.started_at,
      completedAt: record.completed_at,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  static toAttemptDetail(record: any) {
    const isCompleted = record.status === TestAttemptStatus.COMPLETED;
    return {
      ...this.toAttempt(record),
      mockTest: this.toListItem(record.mock_test),
      questions: (record.mock_test?.questions ?? []).map((item: any) => {
        const question = this.toQuestion(item, isCompleted);
        const answer = (record.answers ?? []).find(
          (candidateAnswer: any) =>
            candidateAnswer.question_bank_id === item.question_bank_id,
        );

        return {
          ...question,
          selectedOptionId: answer?.selected_option_id ?? null,
          answeredAt: answer?.answered_at ?? null,
          ...(isCompleted ? { isCorrect: answer?.is_correct ?? false } : {}),
        };
      }),
    };
  }

  static toAnswer(record: any) {
    return {
      questionBankId: record.question_bank_id,
      selectedOptionId: record.selected_option_id,
      answeredAt: record.answered_at,
    };
  }

  static toSubmitResult(record: any) {
    return {
      attemptId: record.id,
      status: record.status,
      score: record.score === null ? null : Number(record.score),
      totalQuestions: record.total_questions,
      correctAnswers: record.correct_answers,
      completedAt: record.completed_at,
    };
  }

  static toResult(record: any) {
    return {
      attemptId: record.id,
      mockTest: this.toListItem(record.mock_test),
      score: record.score === null ? null : Number(record.score),
      totalQuestions: record.total_questions,
      correctAnswers: record.correct_answers,
      startedAt: record.started_at,
      completedAt: record.completed_at,
      answers: (record.mock_test?.questions ?? []).map((item: any) => {
        const question = item.question_bank;
        const answer = (record.answers ?? []).find(
          (candidateAnswer: any) =>
            candidateAnswer.question_bank_id === item.question_bank_id,
        );
        const correctOption = question.interview_question_bank_options?.find(
          (option: any) => option.is_correct,
        );

        return {
          questionId: question.id,
          questionTitle: question.title,
          questionContent: question.content,
          selectedOptionId: answer?.selected_option_id ?? null,
          correctOptionId: correctOption?.id ?? null,
          isCorrect: answer?.is_correct ?? false,
          expectedAnswer: question.expected_answer,
          options: (question.interview_question_bank_options ?? []).map(
            (option: any) => ({
              id: option.id,
              content: option.content,
              isCorrect: option.is_correct,
            }),
          ),
        };
      }),
    };
  }

  private static toQuestion(item: any, includeCorrectAnswers: boolean) {
    const question = item.question_bank;
    return {
      id: question.id,
      title: question.title,
      content: question.content,
      difficulty: question.difficulty,
      technology: question.interview_technologies
        ? {
            id: question.interview_technologies.id,
            name: question.interview_technologies.name,
            slug: question.interview_technologies.slug,
          }
        : null,
      topic: question.interview_topics
        ? {
            id: question.interview_topics.id,
            name: question.interview_topics.name,
            code: question.interview_topics.code,
          }
        : null,
      displayOrder: item.display_order,
      options: (question.interview_question_bank_options ?? []).map(
        (option: any) => ({
          id: option.id,
          content: option.content,
          displayOrder: option.display_order,
          ...(includeCorrectAnswers ? { isCorrect: option.is_correct } : {}),
        }),
      ),
    };
  }
}
