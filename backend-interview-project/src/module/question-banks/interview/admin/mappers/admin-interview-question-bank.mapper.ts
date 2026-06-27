import { AdminInterviewQuestionBankModel } from '../models/admin-interview-question-bank.model';
import { AdminInterviewQuestionBankResponseDto } from '../responses/admin-interview-question-bank-response.dto';
import { AdminInterviewQuestionBankRecord } from '../results/interview-question-bank/admin-interview-question-bank-query-result';

export class AdminInterviewQuestionBankMapper {
  /*
   * Chuyển dữ liệu interview_question_banks từ Prisma sang AdminInterviewQuestionBankModel.
   */
  static toModel(
    questionBank: AdminInterviewQuestionBankRecord,
  ): AdminInterviewQuestionBankModel {
    return new AdminInterviewQuestionBankModel({
      id: questionBank.id,
      topic: {
        id: questionBank.interview_topics.id,
        name: questionBank.interview_topics.name,
        code: questionBank.interview_topics.code,
        description: questionBank.interview_topics.description,
      },
      technology: {
        id: questionBank.interview_technologies.id,
        name: questionBank.interview_technologies.name,
        slug: questionBank.interview_technologies.slug,
        code: questionBank.interview_technologies.code,
        description: questionBank.interview_technologies.description,
      },
      title: questionBank.title,
      content: questionBank.content,
      questionType: questionBank.question_type,
      difficulty: questionBank.difficulty,
      expectedAnswer: questionBank.expected_answer,
      options: questionBank.interview_question_bank_options.map((option) => ({
        id: option.id,
        content: option.content,
        isCorrect: option.is_correct,
        displayOrder: option.display_order,
      })),
      createdBy: questionBank.created_by,
      createdAt: questionBank.created_at,
      updatedAt: questionBank.updated_at,
    });
  }

  /*
   * Chuyển AdminInterviewQuestionBankModel sang response DTO cho API Admin.
   */
  static toResponseDto(
    questionBank: AdminInterviewQuestionBankModel,
  ): AdminInterviewQuestionBankResponseDto {
    return {
      id: questionBank.id,
      topic: questionBank.topic,
      technology: questionBank.technology,
      title: questionBank.title,
      content: questionBank.content,
      questionType: questionBank.questionType,
      difficulty: questionBank.difficulty,
      expectedAnswer: questionBank.expectedAnswer,
      options: questionBank.options,
      createdBy: questionBank.createdBy,
      createdAt: questionBank.createdAt,
      updatedAt: questionBank.updatedAt,
    };
  }
}
