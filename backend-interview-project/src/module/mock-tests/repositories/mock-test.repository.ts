import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MockTestStatus,
  Prisma,
  TestAttemptStatus,
} from 'generated/prisma/client';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { MockTestQueryDto } from '../admin/dtos/mock-test-query.dto';
import { CreateMockTestDto } from '../admin/dtos/create-mock-test.dto';
import { UpdateMockTestDto } from '../admin/dtos/update-mock-test.dto';

@Injectable()
export class MockTestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findPublished(query: MockTestQueryDto) {
    return this.findMany({
      ...query,
      status: MockTestStatus.PUBLISHED,
    });
  }

  async findAllForAdmin(query: MockTestQueryDto) {
    return this.findMany(query);
  }

  async findPublishedBySlug(slug: string) {
    return this.prismaService.mockTest.findFirst({
      where: {
        slug,
        status: MockTestStatus.PUBLISHED,
      },
      ...this.detailInclude(),
    });
  }

  async findById(id: number) {
    return this.prismaService.mockTest.findUnique({
      where: {
        id,
      },
      ...this.detailInclude(),
    });
  }

  async create(adminUserId: number, dto: CreateMockTestDto) {
    return this.prismaService.mockTest.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description ?? null,
        cover_image_url: dto.coverImageUrl ?? null,
        duration_minutes: dto.durationMinutes ?? null,
        created_by: adminUserId,
      },
      ...this.detailInclude(),
    });
  }

  async update(id: number, dto: UpdateMockTestDto) {
    await this.ensureExists(id);

    return this.prismaService.mockTest.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        cover_image_url: dto.coverImageUrl,
        duration_minutes: dto.durationMinutes,
        updated_at: new Date(),
      },
      ...this.detailInclude(),
    });
  }

  async delete(id: number) {
    await this.ensureExists(id);

    return this.prismaService.mockTest.delete({
      where: {
        id,
      },
      ...this.detailInclude(),
    });
  }

  async updateStatus(id: number, status: MockTestStatus) {
    await this.ensureExists(id);

    return this.prismaService.mockTest.update({
      where: {
        id,
      },
      data: {
        status,
        updated_at: new Date(),
      },
      ...this.detailInclude(),
    });
  }

  async replaceQuestions(mockTestId: number, questionBankIds: number[]) {
    const uniqueIds = [...new Set(questionBankIds)];
    if (uniqueIds.length !== questionBankIds.length) {
      throw new BadRequestException('Question bank ids must be unique');
    }

    await this.ensureExists(mockTestId);

    const validQuestionCount =
      await this.prismaService.interview_question_banks.count({
        where: {
          id: {
            in: uniqueIds,
          },
        },
      });

    if (validQuestionCount !== uniqueIds.length) {
      throw new BadRequestException('Some question bank ids are invalid');
    }

    return this.prismaService.$transaction(async (tx) => {
      await tx.mockTestQuestion.deleteMany({
        where: {
          mock_test_id: mockTestId,
        },
      });

      if (uniqueIds.length > 0) {
        await tx.mockTestQuestion.createMany({
          data: uniqueIds.map((questionBankId, index) => ({
            mock_test_id: mockTestId,
            question_bank_id: questionBankId,
            display_order: index + 1,
          })),
        });
      }

      return tx.mockTest.update({
        where: {
          id: mockTestId,
        },
        data: {
          total_questions: uniqueIds.length,
          updated_at: new Date(),
        },
        ...this.detailInclude(),
      });
    });
  }

  async startAttempt(userId: number, mockTestId: number) {
    const mockTest = await this.prismaService.mockTest.findFirst({
      where: {
        id: mockTestId,
        status: MockTestStatus.PUBLISHED,
      },
      include: {
        questions: true,
      },
    });

    if (!mockTest) {
      throw new NotFoundException('Published mock test not found');
    }

    if (mockTest.questions.length === 0) {
      throw new ConflictException('Mock test has no questions');
    }

    return this.prismaService.testAttempt.create({
      data: {
        user_id: userId,
        mock_test_id: mockTestId,
        status: TestAttemptStatus.IN_PROGRESS,
        total_questions: mockTest.questions.length,
        correct_answers: 0,
        started_at: new Date(),
      },
    });
  }

  async findAttemptForUser(userId: number, attemptId: number) {
    const attempt = await this.prismaService.testAttempt.findFirst({
      where: {
        id: attemptId,
        user_id: userId,
      },
      ...this.attemptInclude(),
    });

    if (!attempt) {
      throw new NotFoundException('Test attempt not found');
    }

    return attempt;
  }

  async findAttemptsForUser(userId: number) {
    return this.prismaService.testAttempt.findMany({
      where: {
        user_id: userId,
      },
      include: {
        mock_test: true,
      },
      orderBy: {
        started_at: 'desc',
      },
    });
  }

  async saveAnswer(
    userId: number,
    attemptId: number,
    questionBankId: number,
    selectedOptionId: number,
  ) {
    const attempt = await this.findAttemptForUser(userId, attemptId);

    if (attempt.status !== TestAttemptStatus.IN_PROGRESS) {
      throw new ConflictException('Only in-progress attempts can be answered');
    }

    const questionInTest = attempt.mock_test.questions.some(
      (item: any) => item.question_bank_id === questionBankId,
    );
    if (!questionInTest) {
      throw new BadRequestException('Question does not belong to this attempt');
    }

    const selectedOption =
      await this.prismaService.interview_question_bank_options.findFirst({
        where: {
          id: selectedOptionId,
          question_bank_id: questionBankId,
        },
      });

    if (!selectedOption) {
      throw new BadRequestException(
        'Selected option does not belong to question',
      );
    }

    return this.prismaService.testAttemptAnswer.upsert({
      where: {
        attempt_id_question_bank_id: {
          attempt_id: attemptId,
          question_bank_id: questionBankId,
        },
      },
      update: {
        selected_option_id: selectedOptionId,
        is_correct: selectedOption.is_correct,
        answered_at: new Date(),
      },
      create: {
        attempt_id: attemptId,
        question_bank_id: questionBankId,
        selected_option_id: selectedOptionId,
        is_correct: selectedOption.is_correct,
      },
    });
  }

  async submitAttempt(userId: number, attemptId: number) {
    const attempt = await this.findAttemptForUser(userId, attemptId);

    if (attempt.status !== TestAttemptStatus.IN_PROGRESS) {
      throw new ConflictException('Only in-progress attempts can be submitted');
    }

    const totalQuestions = attempt.mock_test.questions.length;
    const correctAnswers = attempt.answers.filter(
      (answer: any) => answer.is_correct,
    ).length;
    const score =
      totalQuestions === 0
        ? 0
        : Number(((correctAnswers / totalQuestions) * 100).toFixed(2));

    return this.prismaService.testAttempt.update({
      where: {
        id: attemptId,
      },
      data: {
        status: TestAttemptStatus.COMPLETED,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score: new Prisma.Decimal(score),
        completed_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findCompletedResultForUser(userId: number, attemptId: number) {
    const attempt = await this.findAttemptForUser(userId, attemptId);

    if (attempt.status !== TestAttemptStatus.COMPLETED) {
      throw new ConflictException('Attempt result is available after submit');
    }

    return attempt;
  }

  private async findMany(
    query: MockTestQueryDto & { status?: MockTestStatus },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.mockTest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prismaService.mockTest.count({
        where,
      }),
    ]);

    return {
      items,
      meta: {
        total,
        itemCount: items.length,
        page,
        limit,
      },
    };
  }

  private buildWhere(
    query: MockTestQueryDto & { status?: MockTestStatus },
  ): Prisma.MockTestWhereInput {
    const questionFilter: Prisma.MockTestQuestionListRelationFilter = {
      some: {
        question_bank: {
          technology_id: query.technologyId,
          topic_id: query.topicId,
          difficulty: query.difficulty,
        },
      },
    };

    return {
      status: query.status,
      ...(query.keyword
        ? {
            OR: [
              {
                title: {
                  contains: query.keyword,
                },
              },
              {
                description: {
                  contains: query.keyword,
                },
              },
            ],
          }
        : {}),
      ...(query.technologyId || query.topicId || query.difficulty
        ? {
            questions: questionFilter,
          }
        : {}),
    };
  }

  private async ensureExists(id: number) {
    const mockTest = await this.prismaService.mockTest.findUnique({
      where: {
        id,
      },
    });

    if (!mockTest) {
      throw new NotFoundException('Mock test not found');
    }

    return mockTest;
  }

  private detailInclude() {
    return {
      include: {
        questions: {
          orderBy: {
            display_order: 'asc' as const,
          },
          include: {
            question_bank: {
              include: {
                interview_technologies: true,
                interview_topics: true,
                interview_question_bank_options: {
                  orderBy: {
                    display_order: 'asc' as const,
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  private attemptInclude() {
    return {
      include: {
        answers: true,
        mock_test: this.detailInclude(),
      },
    };
  }
}
