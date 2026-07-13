import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { createListMeta } from 'src/shared/responses/api-response.interface';

import { CreateInterviewTopicDto } from '../dtos/create-interview-topic.dto';
import { UpdateInterviewTopicDto } from '../dtos/update-interview-topic.dto';
import { AdminInterviewTopicMapper } from '../mappers/admin-interview-topic.mapper';
import { AdminInterviewTopicModel } from '../models/admin-interview-topic.model';
import { AdminInterviewTopicRepository } from '../repositories/admin-interview-topic.repository';
import { AdminInterviewTopicResponseDto } from '../responses/admin-interview-topic-response.dto';
import { AdminInterviewTopicListResponseResult } from '../results/interview/topic/admin-interview-topic-list-response-result';

@Injectable()
export class AdminInterviewTopicService {
  private readonly logger = new Logger(AdminInterviewTopicService.name);

  /*
   * Inject AdminInterviewTopicRepository để Service xử lý business flow.
   */
  constructor(
    private readonly topicRepository: AdminInterviewTopicRepository,
  ) {}

  /*
   * Tạo mới Interview Topic.
   * Trước khi tạo cần kiểm tra code không bị trùng trong hệ thống.
   */
  async createTopic(
    dto: CreateInterviewTopicDto,
  ): Promise<AdminInterviewTopicResponseDto> {
    this.logger.log(`Start creating interview topic: code=${dto.code}`);

    await this.checkCodeUniqueness(dto.code);

    const topic = await this.topicRepository.createTopic({
      name: dto.name,
      code: dto.code,
      description: dto.description,
    });

    this.logger.log(
      `Interview topic created successfully: id=${topic.id}, name=${topic.name}, code=${topic.code}`,
    );

    return AdminInterviewTopicMapper.toResponseDto(topic);
  }

  /*
   * Lấy toàn bộ danh sách Interview Topic cho Admin.
   * Bao gồm cả Topic đang active và inactive.
   */
  async getTopics(): Promise<AdminInterviewTopicListResponseResult> {
    this.logger.log('Start retrieving interview topics');

    const { items, total } = await this.topicRepository.findAllWithTotal();

    return this.buildListResult(items, total, 'Interview topics retrieved');
  }

  /*
   * Lấy danh sách Interview Topic đang active.
   * Danh sách này dùng cho Admin xem dữ liệu đang được bật trong hệ thống.
   */
  async getActiveTopics(): Promise<AdminInterviewTopicListResponseResult> {
    this.logger.log('Start retrieving active interview topics');

    const { items, total } = await this.topicRepository.findActiveWithTotal();

    return this.buildListResult(
      items,
      total,
      'Active interview topics retrieved',
    );
  }

  /*
   * Lấy danh sách Interview Topic đang inactive.
   * Danh sách này dùng cho Admin xem các Topic đã bị vô hiệu hóa.
   */
  async getInactiveTopics(): Promise<AdminInterviewTopicListResponseResult> {
    this.logger.log('Start retrieving inactive interview topics');

    const { items, total } = await this.topicRepository.findInactiveWithTotal();

    return this.buildListResult(
      items,
      total,
      'Inactive interview topics retrieved',
    );
  }

  /*
   * Cập nhật thông tin Interview Topic theo id.
   * Nếu request có thay đổi code thì cần kiểm tra trùng trước khi update.
   */
  async updateTopic(
    id: number,
    dto: UpdateInterviewTopicDto,
  ): Promise<AdminInterviewTopicResponseDto> {
    this.logger.log(`Start updating interview topic: id=${id}`);

    await this.getTopicByIdOrThrow(id);

    if (dto.code) {
      await this.checkCodeUniqueness(dto.code, id);
    }

    const topic = await this.topicRepository.updateTopic(id, {
      name: dto.name,
      code: dto.code,
      description: dto.description,
    });

    this.logger.log(
      `Interview topic updated successfully: id=${topic.id}, name=${topic.name}, code=${topic.code}`,
    );

    return AdminInterviewTopicMapper.toResponseDto(topic);
  }

  /*
   * Kích hoạt Interview Topic.
   * Sau khi active, Candidate có thể chọn Topic này khi cấu hình focus topics.
   */
  async activateTopic(id: number): Promise<AdminInterviewTopicResponseDto> {
    return this.updateStatus(id, true, 'activating', 'activated');
  }

  /*
   * Vô hiệu hóa Interview Topic.
   * Không xóa cứng để tránh ảnh hưởng Interview hoặc Configuration đã liên kết.
   */
  async deactivateTopic(id: number): Promise<AdminInterviewTopicResponseDto> {
    return this.updateStatus(id, false, 'deactivating', 'deactivated');
  }

  /*
   * Xóa cứng Interview Topic khi chưa được sử dụng.
   */
  async deleteTopic(id: number): Promise<AdminInterviewTopicResponseDto> {
    this.logger.log(`Start deleting interview topic: id=${id}`);

    this.validateId(id);
    await this.getTopicByIdOrThrow(id);

    const usageCount = await this.topicRepository.countUsage(id);

    if (usageCount > 0) {
      this.logger.warn(
        `Delete topic failed because it is in use: id=${id}, usageCount=${usageCount}`,
      );

      throw new ConflictException(
        'Không thể xóa vì dữ liệu đang được sử dụng.',
      );
    }

    const topic = await this.topicRepository.deleteTopic(id);

    this.logger.log(
      `Interview topic deleted successfully: id=${topic.id}, code=${topic.code}`,
    );

    return AdminInterviewTopicMapper.toResponseDto(topic);
  }

  /*
   * Gộp logic build response list cho các API danh sách.
   * Helper này map domain model sang response DTO và tạo meta.
   */
  private buildListResult(
    items: AdminInterviewTopicModel[],
    total: number,
    logMessage: string,
  ): AdminInterviewTopicListResponseResult {
    const data = items.map((item) =>
      AdminInterviewTopicMapper.toResponseDto(item),
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
   * Gộp logic cập nhật trạng thái active/inactive.
   * Dùng chung cho activateTopic và deactivateTopic để tránh lặp code.
   */
  private async updateStatus(
    id: number,
    isActive: boolean,
    startActionText: string,
    endActionText: string,
  ): Promise<AdminInterviewTopicResponseDto> {
    this.logger.log(`Start ${startActionText} interview topic: id=${id}`);

    await this.getTopicByIdOrThrow(id);

    const topic = isActive
      ? await this.topicRepository.activate(id)
      : await this.topicRepository.deactivate(id);

    this.logger.log(
      `Interview topic ${endActionText} successfully: id=${topic.id}, code=${topic.code}`,
    );

    return AdminInterviewTopicMapper.toResponseDto(topic);
  }

  /*
   * Lấy Interview Topic theo id.
   * Nếu không tìm thấy thì throw NotFoundException để dừng request.
   */
  private async getTopicByIdOrThrow(
    id: number,
  ): Promise<AdminInterviewTopicModel> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      this.logger.warn(`Action failed - Interview topic not found: id=${id}`);

      throw new NotFoundException('Interview topic not found');
    }

    return topic;
  }

  /*
   * Kiểm tra code của Interview Topic có bị trùng hay không.
   * Khi update, currentId dùng để bỏ qua chính bản ghi đang được cập nhật.
   */
  private async checkCodeUniqueness(
    code: string,
    currentId?: number,
  ): Promise<void> {
    const existedTopic = await this.topicRepository.findByCode(code);

    if (existedTopic && existedTopic.id !== currentId) {
      this.logger.warn(
        `Action failed - Interview topic code already exists: code=${code}`,
      );

      throw new ConflictException('Interview topic code already exists');
    }
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid interview topic id');
    }
  }
}
