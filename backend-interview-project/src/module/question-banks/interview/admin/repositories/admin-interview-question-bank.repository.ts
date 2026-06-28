import { ConflictException, Injectable } from '@nestjs/common';
import {
  interview_question_banks_difficulty,
  interview_question_banks_question_type,
  interview_technologies,
  interview_topics,
} from 'generated/prisma/client';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { AdminInterviewQuestionBankMapper } from '../mappers/admin-interview-question-bank.mapper';
import { AdminInterviewQuestionBankModel } from '../models/admin-interview-question-bank.model';
import { AdminInterviewQuestionBankListQueryResult } from '../results/interview-question-bank/admin-interview-question-bank-list-query-result';
import { AdminInterviewQuestionBankRecord } from '../results/interview-question-bank/admin-interview-question-bank-query-result';

interface UpsertQuestionBankOptionParams {
  content: string;
  isCorrect: boolean;
  displayOrder: number;
}

interface CreateQuestionBankParams {
  topicId: number;
  technologyId: number;
  title: string;
  content: string;
  questionType: interview_question_banks_question_type;
  difficulty: interview_question_banks_difficulty;
  expectedAnswer?: string;
  createdBy: number;
  options: UpsertQuestionBankOptionParams[];
}

interface UpdateQuestionBankParams {
  topicId?: number;
  technologyId?: number;
  title?: string;
  content?: string;
  questionType?: interview_question_banks_question_type;
  difficulty?: interview_question_banks_difficulty;
  expectedAnswer?: string;
  options?: UpsertQuestionBankOptionParams[];
}

@Injectable()
export class AdminInterviewQuestionBankRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.interview_question_banks);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để lấy nhiều bản ghi từ Prisma model.
   */
  selectMany(query?: any): Promise<any[]> {
    return this.executeSelectMany(query);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để lấy một bản ghi theo unique field như id.
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để tạo mới một bản ghi.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để cập nhật một bản ghi theo unique field.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để xóa một bản ghi theo unique field.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  /*
   * Lấy toàn bộ câu hỏi Interview Question Bank kèm total.
   * Repository trả model để Service tạo response list và meta.
   */
  async findAllWithTotal(): Promise<AdminInterviewQuestionBankListQueryResult> {
    const questionBanks =
      await this.prismaService.interview_question_banks.findMany({
        ...this.buildIncludeQuery(),
        orderBy: {
          id: 'desc',
        },
      });

    return {
      items: questionBanks.map((questionBank) =>
        AdminInterviewQuestionBankMapper.toModel(questionBank),
      ),
      total: questionBanks.length,
    };
  }

  /*
   * Tìm một câu hỏi Interview Question Bank theo id.
   * Dùng cho API xem chi tiết, cập nhật và xóa.
   */
  async findById(id: number): Promise<AdminInterviewQuestionBankModel | null> {
    const questionBank =
      await this.prismaService.interview_question_banks.findUnique({
        where: {
          id,
        },
        ...this.buildIncludeQuery(),
      });

    return questionBank
      ? AdminInterviewQuestionBankMapper.toModel(questionBank)
      : null;
  }

  /*
   * Tìm Technology đang active theo id.
   * Service dùng để đảm bảo câu hỏi chỉ gắn với Technology hợp lệ.
   */
  async findActiveTechnologyById(
    id: number,
  ): Promise<interview_technologies | null> {
    return this.prismaService.interview_technologies.findFirst({
      where: {
        id,
        is_active: true,
      },
    });
  }

  /*
   * Tìm Topic đang active theo id.
   * Service dùng để đảm bảo câu hỏi chỉ gắn với Topic hợp lệ.
   */
  async findActiveTopicById(id: number): Promise<interview_topics | null> {
    return this.prismaService.interview_topics.findFirst({
      where: {
        id,
        is_active: true,
      },
    });
  }

  /*
   * Tạo câu hỏi và options trong transaction.
   * Nếu tạo options lỗi thì câu hỏi chính được rollback cùng transaction.
   */
  async createQuestionBank(
    params: CreateQuestionBankParams,
  ): Promise<AdminInterviewQuestionBankModel> {
    const questionBank = await this.prismaService.$transaction(
      async (tx): Promise<AdminInterviewQuestionBankRecord> => {
        return tx.interview_question_banks.create({
          data: {
            topic_id: params.topicId,
            technology_id: params.technologyId,
            title: params.title,
            content: params.content,
            question_type: params.questionType,
            difficulty: params.difficulty,
            expected_answer: params.expectedAnswer ?? null,
            created_by: params.createdBy,
            ...this.buildNestedOptionsCreateData(params.options),
          },
          ...this.buildIncludeQuery(),
        });
      },
    );

    return AdminInterviewQuestionBankMapper.toModel(questionBank);
  }

  /*
   * Cập nhật câu hỏi Interview Question Bank.
   * Nếu params có options thì replace toàn bộ options cũ trong transaction.
   */
  async updateQuestionBank(
    id: number,
    params: UpdateQuestionBankParams,
  ): Promise<AdminInterviewQuestionBankModel> {
    const data = {
      topic_id: params.topicId,
      technology_id: params.technologyId,
      title: params.title,
      content: params.content,
      question_type: params.questionType,
      difficulty: params.difficulty,
      expected_answer: params.expectedAnswer,
      updated_at: new Date(),
    };

    const questionBank =
      params.options !== undefined
        ? await this.updateQuestionBankWithOptions(id, data, params.options)
        : await this.prismaService.interview_question_banks.update({
            where: {
              id,
            },
            data,
            ...this.buildIncludeQuery(),
          });

    return AdminInterviewQuestionBankMapper.toModel(questionBank);
  }

  /*
   * Xóa câu hỏi Interview Question Bank.
   * Nếu câu hỏi đã được dùng trong interview session thì không xóa.
   */
  async deleteQuestionBank(
    id: number,
  ): Promise<AdminInterviewQuestionBankModel> {
    const usedCount =
      await this.prismaService.interview_session_questions.count({
        where: {
          question_bank_id: id,
        },
      });

    if (usedCount > 0) {
      throw new ConflictException('Interview question bank is already used');
    }

    const questionBank =
      await this.prismaService.interview_question_banks.delete({
        where: {
          id,
        },
        ...this.buildIncludeQuery(),
      });

    return AdminInterviewQuestionBankMapper.toModel(questionBank);
  }

  /*
   * Replace toàn bộ options cũ bằng options mới trong transaction khi cập nhật.
   */
  private async updateQuestionBankWithOptions(
    id: number,
    data: {
      topic_id?: number;
      technology_id?: number;
      title?: string;
      content?: string;
      question_type?: interview_question_banks_question_type;
      difficulty?: interview_question_banks_difficulty;
      expected_answer?: string;
      updated_at: Date;
    },
    options: UpsertQuestionBankOptionParams[],
  ): Promise<AdminInterviewQuestionBankRecord> {
    return this.prismaService.$transaction(
      async (tx): Promise<AdminInterviewQuestionBankRecord> => {
        await tx.interview_question_bank_options.deleteMany({
          where: {
            question_bank_id: id,
          },
        });

        if (options.length > 0) {
          await tx.interview_question_bank_options.createMany({
            data: options.map((option) => ({
              question_bank_id: id,
              ...this.buildOptionCreateData(option),
            })),
          });
        }

        return tx.interview_question_banks.update({
          where: {
            id,
          },
          data,
          ...this.buildIncludeQuery(),
        });
      },
    );
  }

  /*
   * Build dữ liệu tạo option theo đúng field snake_case của Prisma schema.
   */
  private buildOptionCreateData(option: UpsertQuestionBankOptionParams): {
    content: string;
    is_correct: boolean;
    display_order: number;
  } {
    return {
      content: option.content,
      is_correct: option.isCorrect,
      display_order: option.displayOrder,
    };
  }

  /*
   * Build nested create options cho Prisma create.
   * Nếu câu hỏi không có options thì không gửi nested create để tránh dữ liệu thừa.
   */
  private buildNestedOptionsCreateData(
    options: UpsertQuestionBankOptionParams[],
  ): {
    interview_question_bank_options?: {
      create: {
        content: string;
        is_correct: boolean;
        display_order: number;
      }[];
    };
  } {
    if (options.length === 0) {
      return {};
    }

    return {
      interview_question_bank_options: {
        create: options.map((option) => this.buildOptionCreateData(option)),
      },
    };
  }

  /*
   * Build include query dùng chung để lấy đủ relation cần trả về API.
   */
  private buildIncludeQuery(): {
    include: {
      interview_topics: true;
      interview_technologies: true;
      interview_question_bank_options: {
        orderBy: {
          display_order: 'asc';
        };
      };
    };
  } {
    return {
      include: {
        interview_topics: true,
        interview_technologies: true,
        interview_question_bank_options: {
          orderBy: {
            display_order: 'asc',
          },
        },
      },
    };
  }
}
