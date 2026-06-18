import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  interview_configurations_interview_type,
  interview_question_banks_difficulty,
  interview_question_banks_question_type,
  interview_session_questions_difficulty,
  interview_session_questions_question_type,
  interview_sessions_status,
} from '../../../generated/prisma/enums';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AiService } from '../ai/ai.service';
import { StorageService, UploadedAudioFile } from '../storage/storage.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitInterviewAnswerDto } from './dto/submit-answer.dto';

export interface StartInterviewResult {
  sessionId: number;
  status: string;
}

export interface GenerateQuestionsResult {
  sessionId: number;
  questionIds: number[];
}

export interface SubmitAnswerResult {
  answerId: number;
  questionId: number;
  audioUrl?: string;
  aiScore: number;
  aiFeedback: string;
}

interface InterviewConfigurationContext {
  position: string;
  experienceLevel: string;
  technologies: string[];
  focusTopics: string[];
  primaryTechnologyId: number;
  primaryTopicId: number;
}

/**
 * Service nghiệp vụ cho luồng mock interview.
 *
 * Service điều phối database, MinIO và AI qua dependency injection. Controller
 * không chứa nghiệp vụ, còn service này không phụ thuộc trực tiếp vào model AI
 * cụ thể để sau này dễ thay provider.
 */
@Injectable()
export class InterviewsService {
  private readonly logger = new Logger(InterviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Tạo phiên mock interview mới từ cấu hình người dùng.
   *
   * @param userId Id người dùng đã xác thực.
   * @param dto Cấu hình vị trí, cấp độ, công nghệ và chủ đề tập trung.
   * @returns Id phiên vừa tạo và trạng thái ban đầu.
   * @throws InternalServerErrorException Khi database không thể tạo phiên.
   */
  async startInterview(
    userId: number,
    dto: StartInterviewDto,
  ): Promise<StartInterviewResult> {
    try {
      const position = await this.ensurePosition(dto.position);
      const level = await this.ensureLevel(dto.experienceLevel);
      const technologies = await this.ensureTechnologies(dto.technologies);
      const topics = await this.ensureTopics(dto.focusTopics);
      const configuration = await this.prisma.interview_configurations.create({
        data: {
          user_id: userId,
          position_id: position.id,
          level_id: level.id,
          name: `${dto.position} - ${dto.experienceLevel}`,
          interview_type: interview_configurations_interview_type.MIXED,
          question_count: dto.questionCount ?? 5,
          duration_minutes: dto.durationMinutes ?? 30,
          description: this.buildConfigurationDescription(dto),
        },
        select: {
          id: true,
        },
      });

      await Promise.all([
        ...technologies.map((technology) =>
          this.prisma.interview_configuration_technologies.create({
            data: {
              configuration_id: configuration.id,
              technology_id: technology.id,
            },
          }),
        ),
        ...topics.map((topic) =>
          this.prisma.interview_configuration_topics.create({
            data: {
              configuration_id: configuration.id,
              topic_id: topic.id,
            },
          }),
        ),
      ]);

      const session = await this.prisma.interview_sessions.create({
        data: {
          configuration_id: configuration.id,
          user_id: userId,
          status: interview_sessions_status.PENDING,
        },
        select: {
          id: true,
          status: true,
        },
      });

      return {
        sessionId: session.id,
        status: session.status,
      };
    } catch (error) {
      this.logger.error(
        `Không thể tạo phiên phỏng vấn cho userId=${userId}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể tạo phiên phỏng vấn. Vui lòng thử lại sau.',
      );
    }
  }

  /**
   * Sinh câu hỏi cho phiên phỏng vấn và lưu vào database.
   *
   * @param userId Id người dùng sở hữu phiên.
   * @param sessionId Id phiên cần sinh câu hỏi.
   * @returns Danh sách id câu hỏi đã tạo.
   * @throws NotFoundException Khi phiên không tồn tại hoặc không thuộc user.
   * @throws InternalServerErrorException Khi lưu câu hỏi thất bại.
   */
  async generateQuestions(
    userId: number,
    sessionId: number,
  ): Promise<GenerateQuestionsResult> {
    const session = await this.findOwnedSession(userId, sessionId);

    if (!session) {
      throw new NotFoundException('Phiên phỏng vấn không tồn tại.');
    }

    try {
      const context = this.toConfigurationContext(session);
      const questionContents = this.aiService.generateInterviewQuestions({
        position: context.position,
        experienceLevel: context.experienceLevel,
        technologies: context.technologies,
        focusTopics: context.focusTopics,
        questionCount: session.interview_configurations.question_count,
      });
      const createdQuestionIds: number[] = [];

      for (const [index, content] of questionContents.entries()) {
        const questionBank = await this.prisma.interview_question_banks.create({
          data: {
            topic_id: context.primaryTopicId,
            technology_id: context.primaryTechnologyId,
            title: `Session ${sessionId} Question ${index + 1}`,
            content,
            question_type: interview_question_banks_question_type.THEORY,
            difficulty: interview_question_banks_difficulty.MEDIUM,
            created_by: userId,
          },
          select: {
            id: true,
          },
        });
        const question = await this.prisma.interview_session_questions.create({
          data: {
            session_id: sessionId,
            question_bank_id: questionBank.id,
            content,
            question_type: interview_session_questions_question_type.THEORY,
            difficulty: interview_session_questions_difficulty.MEDIUM,
            display_order: index + 1,
          },
          select: {
            id: true,
          },
        });

        createdQuestionIds.push(question.id);
      }

      await this.prisma.interview_sessions.update({
        where: {
          id: sessionId,
        },
        data: {
          status: interview_sessions_status.IN_PROGRESS,
          started_at: new Date(),
          updated_at: new Date(),
        },
      });

      return {
        sessionId,
        questionIds: createdQuestionIds,
      };
    } catch (error) {
      this.logger.error(
        `Không thể sinh câu hỏi cho sessionId=${sessionId}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể sinh câu hỏi phỏng vấn. Vui lòng thử lại sau.',
      );
    }
  }

  /**
   * Ghi nhận câu trả lời text hoặc audio và tạo đánh giá AI dạng stub.
   *
   * @param userId Id người dùng đang trả lời.
   * @param questionId Id câu hỏi được trả lời.
   * @param dto Nội dung trả lời text nếu có.
   * @param audioFile File audio multipart nếu có.
   * @returns Id answer và kết quả đánh giá.
   * @throws BadRequestException Khi không có text lẫn audio.
   * @throws NotFoundException Khi câu hỏi không tồn tại hoặc không thuộc user.
   * @throws InternalServerErrorException Khi lưu answer hoặc review thất bại.
   */
  async submitAnswer(
    userId: number,
    questionId: number,
    dto: SubmitInterviewAnswerDto,
    audioFile?: UploadedAudioFile,
  ): Promise<SubmitAnswerResult> {
    const textContent = dto.textContent?.trim();

    if (!textContent && !audioFile) {
      throw new BadRequestException(
        'Cần cung cấp câu trả lời text hoặc audio.',
      );
    }

    const question = await this.findOwnedQuestion(userId, questionId);

    if (!question) {
      throw new NotFoundException('Câu hỏi phỏng vấn không tồn tại.');
    }

    try {
      const audioUrl = audioFile
        ? await this.storageService.uploadInterviewAudio(
            audioFile,
            userId,
            questionId,
          )
        : undefined;
      const answer = await this.prisma.interview_answers.create({
        data: {
          session_question_id: questionId,
          user_id: userId,
          answer_text: textContent,
          source_code: audioUrl,
          submitted_at: new Date(),
        },
        select: {
          id: true,
        },
      });
      const evaluation = this.aiService.evaluateInterviewAnswer({
        questionContent: question.content,
        answerText: textContent,
        audioUrl,
      });

      await this.prisma.interview_answer_reviews.create({
        data: {
          answer_id: answer.id,
          score: evaluation.score,
          feedback: evaluation.feedback,
          ai_model: 'stub-ai-service',
        },
      });

      return {
        answerId: answer.id,
        questionId,
        audioUrl,
        aiScore: evaluation.score,
        aiFeedback: evaluation.feedback,
      };
    } catch (error) {
      this.logger.error(
        `Không thể lưu câu trả lời questionId=${questionId}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể lưu câu trả lời phỏng vấn. Vui lòng thử lại sau.',
      );
    }
  }

  private async ensurePosition(name: string): Promise<{ id: number }> {
    return this.prisma.interview_positions.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
      select: {
        id: true,
      },
    });
  }

  private async ensureLevel(name: string): Promise<{ id: number }> {
    return this.prisma.interview_levels.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
        display_order: this.resolveLevelDisplayOrder(name),
      },
      select: {
        id: true,
      },
    });
  }

  private async ensureTechnologies(
    names: string[],
  ): Promise<Array<{ id: number; name: string }>> {
    return Promise.all(
      names.map((name) =>
        this.prisma.interview_technologies.upsert({
          where: {
            name,
          },
          update: {},
          create: {
            name,
            slug: this.slugify(name),
          },
          select: {
            id: true,
            name: true,
          },
        }),
      ),
    );
  }

  private async ensureTopics(
    names: string[],
  ): Promise<Array<{ id: number; name: string }>> {
    return Promise.all(
      names.map((name) =>
        this.prisma.interview_topics.upsert({
          where: {
            name,
          },
          update: {},
          create: {
            name,
          },
          select: {
            id: true,
            name: true,
          },
        }),
      ),
    );
  }

  private async findOwnedSession(userId: number, sessionId: number) {
    return this.prisma.interview_sessions.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
      },
      include: {
        interview_configurations: {
          include: {
            interview_positions: true,
            interview_levels: true,
            interview_configuration_technologies: {
              include: {
                interview_technologies: true,
              },
            },
            interview_configuration_topics: {
              include: {
                interview_topics: true,
              },
            },
          },
        },
      },
    });
  }

  private async findOwnedQuestion(userId: number, questionId: number) {
    return this.prisma.interview_session_questions.findFirst({
      where: {
        id: questionId,
        interview_sessions: {
          user_id: userId,
        },
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  private toConfigurationContext(
    session: NonNullable<Awaited<ReturnType<typeof this.findOwnedSession>>>,
  ): InterviewConfigurationContext {
    const configuration = session.interview_configurations;
    const technologies = configuration.interview_configuration_technologies.map(
      (item) => item.interview_technologies,
    );
    const topics = configuration.interview_configuration_topics.map(
      (item) => item.interview_topics,
    );

    if (!technologies[0] || !topics[0]) {
      throw new BadRequestException(
        'Cấu hình phiên phỏng vấn thiếu công nghệ hoặc chủ đề.',
      );
    }

    return {
      position: configuration.interview_positions.name,
      experienceLevel: configuration.interview_levels.name,
      technologies: technologies.map((technology) => technology.name),
      focusTopics: topics.map((topic) => topic.name),
      primaryTechnologyId: technologies[0].id,
      primaryTopicId: topics[0].id,
    };
  }

  private buildConfigurationDescription(dto: StartInterviewDto): string {
    return JSON.stringify({
      technologies: dto.technologies,
      focusTopics: dto.focusTopics,
    });
  }

  private resolveLevelDisplayOrder(level: string): number {
    const normalizedLevel = level.trim().toLowerCase();
    const displayOrderByLevel: Record<string, number> = {
      junior: 1,
      middle: 2,
      mid: 2,
      senior: 3,
      lead: 4,
    };

    return displayOrderByLevel[normalizedLevel] ?? 99;
  }

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
