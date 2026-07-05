import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { interview_question_banks_question_type } from 'generated/prisma/client';

import { createListMeta } from 'src/shared/responses/api-response.interface';

import { CreateInterviewQuestionBankOptionDto } from '../dtos/create-interview-question-bank-option.dto';
import { CreateInterviewQuestionBankDto } from '../dtos/create-interview-question-bank.dto';
import { UpdateInterviewQuestionBankDto } from '../dtos/update-interview-question-bank.dto';
import { AdminInterviewQuestionBankMapper } from '../mappers/admin-interview-question-bank.mapper';
import { AdminInterviewQuestionBankModel } from '../models/admin-interview-question-bank.model';
import { AdminInterviewQuestionBankRepository } from '../repositories/admin-interview-question-bank.repository';
import { AdminInterviewQuestionBankResponseDto } from '../responses/admin-interview-question-bank-response.dto';
import { AdminInterviewQuestionBankListResponseResult } from '../results/interview-question-bank/admin-interview-question-bank-list-response-result';

@Injectable()
export class AdminInterviewQuestionBankService {
  private readonly logger = new Logger(AdminInterviewQuestionBankService.name);

  /*
   * Inject AdminInterviewQuestionBankRepository để Service xử lý business flow.
   */
  constructor(
    private readonly questionBankRepository: AdminInterviewQuestionBankRepository,
  ) {}

  /*
   * Tạo câu hỏi mới trong Interview Question Bank.
   * Service validate master data, options và gắn createdBy từ token hiện tại.
   */
  async createQuestionBank(
    adminUserId: number,
    dto: CreateInterviewQuestionBankDto,
  ): Promise<AdminInterviewQuestionBankResponseDto> {
    this.logger.log(
      `Start creating interview question bank: title=${dto.title}, adminUserId=${adminUserId}`,
    );

    await this.validateActiveTechnology(dto.technologyId);
    await this.validateActiveTopic(dto.topicId);
    this.validateOptionsByQuestionType(dto.questionType, dto.options);

    const questionBank = await this.questionBankRepository.createQuestionBank({
      topicId: dto.topicId,
      technologyId: dto.technologyId,
      title: dto.title,
      content: dto.content,
      questionType: dto.questionType,
      difficulty: dto.difficulty,
      expectedAnswer: dto.expectedAnswer,
      createdBy: adminUserId,
      options: dto.options ?? [],
    });

    this.logger.log(
      `Interview question bank created successfully: id=${questionBank.id}, adminUserId=${adminUserId}`,
    );

    return AdminInterviewQuestionBankMapper.toResponseDto(questionBank);
  }

  /*
   * Lấy danh sách câu hỏi Interview Question Bank cho Admin.
   * API trả data và meta ở top-level theo response pattern hiện tại.
   */
  async getQuestionBanks(): Promise<AdminInterviewQuestionBankListResponseResult> {
    this.logger.log('Start retrieving interview question banks');

    const { items, total } =
      await this.questionBankRepository.findAllWithTotal();

    return this.buildListResult(
      items,
      total,
      'Interview question banks retrieved',
    );
  }

  /*
   * Lấy chi tiết một câu hỏi Interview Question Bank theo id.
   * Nếu không tồn tại thì trả Not Found.
   */
  async getQuestionBankById(
    id: number,
  ): Promise<AdminInterviewQuestionBankResponseDto> {
    this.logger.log(`Start retrieving interview question bank: id=${id}`);

    const questionBank = await this.getQuestionBankByIdOrThrow(id);

    this.logger.log(
      `Interview question bank retrieved successfully: id=${questionBank.id}`,
    );

    return AdminInterviewQuestionBankMapper.toResponseDto(questionBank);
  }

  /*
   * Cập nhật câu hỏi Interview Question Bank.
   * Nếu request có options thì repository sẽ replace toàn bộ options cũ.
   */
  async updateQuestionBank(
    id: number,
    dto: UpdateInterviewQuestionBankDto,
  ): Promise<AdminInterviewQuestionBankResponseDto> {
    this.logger.log(`Start updating interview question bank: id=${id}`);

    const currentQuestionBank = await this.getQuestionBankByIdOrThrow(id);

    if (dto.technologyId) {
      await this.validateActiveTechnology(dto.technologyId);
    }

    if (dto.topicId) {
      await this.validateActiveTopic(dto.topicId);
    }

    this.validateUpdateOptions(currentQuestionBank, dto);

    const questionBank = await this.questionBankRepository.updateQuestionBank(
      id,
      {
        topicId: dto.topicId,
        technologyId: dto.technologyId,
        title: dto.title,
        content: dto.content,
        questionType: dto.questionType,
        difficulty: dto.difficulty,
        expectedAnswer: dto.expectedAnswer,
        options: dto.options,
      },
    );

    this.logger.log(
      `Interview question bank updated successfully: id=${questionBank.id}`,
    );

    return AdminInterviewQuestionBankMapper.toResponseDto(questionBank);
  }

  /*
   * Xóa câu hỏi Interview Question Bank theo id.
   * Repository sẽ chặn xóa nếu câu hỏi đã được dùng trong interview session.
   */
  async deleteQuestionBank(
    id: number,
  ): Promise<AdminInterviewQuestionBankResponseDto> {
    this.logger.log(`Start deleting interview question bank: id=${id}`);

    await this.getQuestionBankByIdOrThrow(id);

    const questionBank =
      await this.questionBankRepository.deleteQuestionBank(id);

    this.logger.log(
      `Interview question bank deleted successfully: id=${questionBank.id}`,
    );

    return AdminInterviewQuestionBankMapper.toResponseDto(questionBank);
  }

  /*
   * Gộp logic build response list.
   * Helper này map domain model sang response DTO và tạo meta.
   */
  private buildListResult(
    items: AdminInterviewQuestionBankModel[],
    total: number,
    logMessage: string,
  ): AdminInterviewQuestionBankListResponseResult {
    const data = items.map((item) =>
      AdminInterviewQuestionBankMapper.toResponseDto(item),
    );

    this.logger.log(
      `${logMessage} successfully: total=${total}, itemCount=${data.length}`,
    );

    return {
      data,
      meta: createListMeta({
        total,
        itemCount: data.length,
      }),
    };
  }

  /*
   * Lấy câu hỏi theo id hoặc throw NotFoundException.
   * Helper dùng chung cho xem chi tiết, cập nhật và xóa.
   */
  private async getQuestionBankByIdOrThrow(
    id: number,
  ): Promise<AdminInterviewQuestionBankModel> {
    const questionBank = await this.questionBankRepository.findById(id);

    if (!questionBank) {
      this.logger.warn(
        `Action failed - Interview question bank not found: id=${id}`,
      );

      throw new NotFoundException('Interview question bank not found');
    }

    return questionBank;
  }

  /*
   * Kiểm tra Technology tồn tại và đang active.
   * Nếu không hợp lệ thì dừng request bằng BadRequestException.
   */
  private async validateActiveTechnology(technologyId: number): Promise<void> {
    const technology =
      await this.questionBankRepository.findActiveTechnologyById(technologyId);

    if (!technology) {
      this.logger.warn(
        `Action failed - Interview technology not found or inactive: id=${technologyId}`,
      );

      throw new BadRequestException(
        'Interview technology not found or inactive',
      );
    }
  }

  /*
   * Kiểm tra Topic tồn tại và đang active.
   * Nếu không hợp lệ thì dừng request bằng BadRequestException.
   */
  private async validateActiveTopic(topicId: number): Promise<void> {
    const topic =
      await this.questionBankRepository.findActiveTopicById(topicId);

    if (!topic) {
      this.logger.warn(
        `Action failed - Interview topic not found or inactive: id=${topicId}`,
      );

      throw new BadRequestException('Interview topic not found or inactive');
    }
  }

  /*
   * Validate options theo trạng thái cuối cùng khi cập nhật.
   * Nếu đổi type mà không gửi options, hệ thống vẫn kiểm tra options hiện tại.
   */
  private validateUpdateOptions(
    currentQuestionBank: AdminInterviewQuestionBankModel,
    dto: UpdateInterviewQuestionBankDto,
  ): void {
    const nextQuestionType =
      dto.questionType ?? currentQuestionBank.questionType;
    const nextOptions =
      dto.options ??
      currentQuestionBank.options.map((option) => ({
        content: option.content,
        isCorrect: option.isCorrect,
        displayOrder: option.displayOrder,
      }));

    if (dto.questionType !== undefined || dto.options !== undefined) {
      this.validateOptionsByQuestionType(nextQuestionType, nextOptions);
    }
  }

  /*
   * Validate options theo loại câu hỏi.
   * MCQ cần ít nhất 2 option, có đáp án đúng và displayOrder không trùng.
   */
  private validateOptionsByQuestionType(
    questionType: interview_question_banks_question_type,
    options?: CreateInterviewQuestionBankOptionDto[],
  ): void {
    const normalizedOptions = options ?? [];

    if (questionType !== interview_question_banks_question_type.MCQ) {
      if (normalizedOptions.length > 0) {
        throw new BadRequestException(
          'Options are only allowed for MCQ questions',
        );
      }

      return;
    }

    if (normalizedOptions.length < 2) {
      throw new BadRequestException('MCQ questions require at least 2 options');
    }

    const correctOptionCount = normalizedOptions.filter(
      (option) => option.isCorrect,
    ).length;

    if (correctOptionCount !== 1) {
      throw new BadRequestException(
        'MCQ questions require exactly 1 correct option',
      );
    }

    this.validateOptionContents(normalizedOptions);
    this.validateOptionDisplayOrders(normalizedOptions);
  }

  /*
   * Kiểm tra nội dung option không được rỗng sau khi trim.
   */
  private validateOptionContents(
    options: CreateInterviewQuestionBankOptionDto[],
  ): void {
    const hasEmptyContent = options.some(
      (option) => !option.content || option.content.trim().length === 0,
    );

    if (hasEmptyContent) {
      throw new BadRequestException('Option content must not be empty');
    }
  }

  /*
   * Kiểm tra displayOrder của options không bị trùng.
   */
  private validateOptionDisplayOrders(
    options: CreateInterviewQuestionBankOptionDto[],
  ): void {
    const displayOrders = options.map((option) => option.displayOrder);
    const uniqueDisplayOrders = new Set(displayOrders);

    if (uniqueDisplayOrders.size !== displayOrders.length) {
      throw new BadRequestException('Option displayOrder must be unique');
    }
  }
}
