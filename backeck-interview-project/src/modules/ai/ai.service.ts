import { Injectable } from '@nestjs/common';

export interface GenerateInterviewQuestionsInput {
  position: string;
  experienceLevel: string;
  technologies: string[];
  focusTopics: string[];
  questionCount: number;
}

export interface EvaluateInterviewAnswerInput {
  questionContent: string;
  answerText?: string;
  audioUrl?: string;
}

export interface AnswerEvaluationResult {
  score: number;
  feedback: string;
}

/**
 * Service biên cho các tác vụ AI của hệ thống phỏng vấn.
 *
 * Hiện tại service chỉ cung cấp stub để cố định contract nghiệp vụ. Khi tích
 * hợp OpenAI, Llama hoặc provider khác, chỉ cần thay implementation tại đây
 * thay vì chỉnh MockInterviewsService.
 */
@Injectable()
export class AiService {
  /**
   * Sinh danh sách câu hỏi phỏng vấn từ cấu hình phiên.
   *
   * @param input Cấu hình phiên phỏng vấn do người dùng chọn.
   * @returns Danh sách câu hỏi dạng text.
   */
  generateInterviewQuestions(input: GenerateInterviewQuestionsInput): string[] {
    const technologies = input.technologies.join(', ') || 'công nghệ chính';
    const focusTopics = input.focusTopics.join(', ') || 'nền tảng kỹ thuật';

    return Array.from({ length: input.questionCount }, (_, index) => {
      const order = index + 1;

      return `Câu ${order}: Với vị trí ${input.position} cấp độ ${input.experienceLevel}, hãy trình bày kinh nghiệm của bạn về ${technologies}, tập trung vào ${focusTopics}.`;
    });
  }

  /**
   * Đánh giá câu trả lời phỏng vấn.
   *
   * @param input Nội dung câu hỏi và câu trả lời cần đánh giá.
   * @returns Điểm và phản hồi dạng stub để giữ luồng nghiệp vụ hoạt động.
   */
  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): AnswerEvaluationResult {
    const hasAnswer = Boolean(input.answerText?.trim() || input.audioUrl);

    return {
      score: hasAnswer ? 7 : 0,
      feedback: hasAnswer
        ? 'Câu trả lời đã được ghi nhận. Phần đánh giá chi tiết sẽ được thay bằng AI provider ở bước tích hợp tiếp theo.'
        : 'Chưa có nội dung trả lời để đánh giá.',
    };
  }
}
