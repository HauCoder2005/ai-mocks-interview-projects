import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateCandidateInterviewConfigurationDto } from '../dtos/create-candidate-interview-configuration.dto';
import { CandidateInterviewConfigurationMapper } from '../mappers/candidate-interview-configuration.mapper';
import { CandidateInterviewConfigurationRepository } from '../repositories/candidate-interview-configuration.repository';
import { CandidateInterviewConfigurationResponseDto } from '../responses/candidate-interview-configuration-response.dto';

@Injectable()
export class CandidateInterviewConfigurationService {
  private readonly logger = new Logger(
    CandidateInterviewConfigurationService.name,
  );

  /*
   * Inject CandidateInterviewConfigurationRepository để Service xử lý business flow.
   */
  constructor(
    private readonly configurationRepository: CandidateInterviewConfigurationRepository,
  ) {}

  /*
   * Tạo Interview Configuration cho Candidate hiện tại.
   * Flow này validate đủ master data trước khi ghi configuration và relation.
   */
  async createConfiguration(
    userId: number,
    dto: CreateCandidateInterviewConfigurationDto,
  ): Promise<CandidateInterviewConfigurationResponseDto> {
    this.logger.log(
      `Start creating interview configuration: userId=${userId}, name=${dto.name}`,
    );

    const technologyIds = this.normalizeIdList(dto.technologyIds);
    const topicIds = this.normalizeIdList(dto.topicIds ?? []);

    this.validateTechnologyIdsNotEmpty(technologyIds);

    await Promise.all([
      this.validatePosition(dto.positionId),
      this.validateLevel(dto.levelId),
      this.validateTechnologies(technologyIds),
      this.validateTopics(topicIds),
    ]);

    const result = await this.configurationRepository.createConfiguration({
      userId,
      positionId: dto.positionId,
      levelId: dto.levelId,
      name: dto.name,
      interviewType: dto.interviewType,
      questionCount: dto.questionCount,
      durationMinutes: dto.durationMinutes,
      description: dto.description,
      technologyIds,
      topicIds,
    });

    const configurationModel = CandidateInterviewConfigurationMapper.toModel(
      result.configuration,
    );

    this.logger.log(
      `Interview configuration created successfully: id=${configurationModel.id}, userId=${configurationModel.userId}`,
    );

    return this.buildResponse(configurationModel);
  }

  /*
   * Chuẩn hóa danh sách id bằng Set.
   * Helper này chống duplicate relation kể cả khi DTO đã dùng ArrayUnique.
   */
  private normalizeIdList(ids: number[]): number[] {
    return [...new Set(ids)];
  }

  /*
   * Kiểm tra danh sách Technology không được rỗng.
   * Mỗi Interview Configuration bắt buộc có ít nhất một Technology.
   */
  private validateTechnologyIdsNotEmpty(technologyIds: number[]): void {
    if (technologyIds.length === 0) {
      this.logger.warn(
        'Create configuration failed because technologyIds is empty',
      );

      throw new BadRequestException(
        'Interview configuration must have at least one technology',
      );
    }
  }

  /*
   * Validate Position tồn tại và đang active.
   * Candidate không được chọn Position đã bị vô hiệu hóa.
   */
  private async validatePosition(positionId: number): Promise<void> {
    const position =
      await this.configurationRepository.findActivePositionById(positionId);

    if (!position) {
      this.logger.warn(
        `Create configuration failed because position is not active or not found: positionId=${positionId}`,
      );

      throw new NotFoundException('Interview position not found or inactive');
    }
  }

  /*
   * Validate Level tồn tại và đang active.
   * Candidate không được chọn Level đã bị vô hiệu hóa.
   */
  private async validateLevel(levelId: number): Promise<void> {
    const level =
      await this.configurationRepository.findActiveLevelById(levelId);

    if (!level) {
      this.logger.warn(
        `Create configuration failed because level is not active or not found: levelId=${levelId}`,
      );

      throw new NotFoundException('Interview level not found or inactive');
    }
  }

  /*
   * Validate toàn bộ Technology ids đều tồn tại và active.
   * Nếu thiếu bất kỳ id nào thì dừng request trước khi tạo configuration.
   */
  private async validateTechnologies(technologyIds: number[]): Promise<void> {
    const technologies =
      await this.configurationRepository.findActiveTechnologiesByIds(
        technologyIds,
      );

    if (technologies.length !== technologyIds.length) {
      const activeTechnologyIds = new Set(
        technologies.map((technology) => technology.id),
      );
      const invalidTechnologyIds = technologyIds.filter(
        (technologyId) => !activeTechnologyIds.has(technologyId),
      );

      this.logger.warn(
        `Create configuration failed because technologies are not active or not found: technologyIds=${invalidTechnologyIds.join(',')}`,
      );

      throw new BadRequestException(
        `Interview technologies not found or inactive: ${invalidTechnologyIds.join(', ')}`,
      );
    }
  }

  /*
   * Validate toàn bộ Topic ids đều tồn tại và active.
   * topicIds optional nên mảng rỗng được xem là hợp lệ.
   */
  private async validateTopics(topicIds: number[]): Promise<void> {
    if (topicIds.length === 0) {
      return;
    }

    const topics =
      await this.configurationRepository.findActiveTopicsByIds(topicIds);

    if (topics.length !== topicIds.length) {
      const activeTopicIds = new Set(topics.map((topic) => topic.id));
      const invalidTopicIds = topicIds.filter(
        (topicId) => !activeTopicIds.has(topicId),
      );

      this.logger.warn(
        `Create configuration failed because topics are not active or not found: topicIds=${invalidTopicIds.join(',')}`,
      );

      throw new BadRequestException(
        `Interview topics not found or inactive: ${invalidTopicIds.join(', ')}`,
      );
    }
  }

  /*
   * Build response DTO từ domain model.
   * Helper này giữ service không trả raw Prisma object.
   */
  private buildResponse(
    configurationModel: ReturnType<
      typeof CandidateInterviewConfigurationMapper.toModel
    >,
  ): CandidateInterviewConfigurationResponseDto {
    return CandidateInterviewConfigurationMapper.toResponseDto(
      configurationModel,
    );
  }
}
