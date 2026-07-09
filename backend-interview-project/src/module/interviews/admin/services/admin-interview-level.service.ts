import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { createListMeta } from 'src/shared/responses/api-response.interface';

import { CreateInterviewLevelDto } from '../dtos/create-interview-level.dto';
import { UpdateInterviewLevelDto } from '../dtos/update-interview-level.dto';
import { AdminInterviewLevelMapper } from '../mappers/admin-interview-level.mapper';
import { AdminInterviewLevelModel } from '../models/admin-interview-level.model';
import { AdminInterviewLevelRepository } from '../repositories/admin-interview-level.repository';
import { AdminInterviewLevelResponseDto } from '../responses/admin-interview-level-response.dto';
import { AdminInterviewLevelListResponseResult } from '../results/interview/level/admin-interview-level-list-response-result';

@Injectable()
export class AdminInterviewLevelService {
  private readonly logger = new Logger(AdminInterviewLevelService.name);

  constructor(
    private readonly levelRepository: AdminInterviewLevelRepository,
  ) {}

  /*
   * Tạo mới Interview Level.
   * Admin dùng chức năng này để thêm master data Level như Intern, Fresher, Junior, Middle, Senior.
   */
  async createLevel(
    dto: CreateInterviewLevelDto,
  ): Promise<AdminInterviewLevelResponseDto> {
    this.logger.log(`Start creating interview level: code=${dto.code}`);
    await this.checkCodeUniqueness(dto.code);
    const level = await this.levelRepository.createLevel({
      name: dto.name,
      code: dto.code,
      description: dto.description,
      displayOrder: dto.displayOrder,
    });
    this.logger.log(
      `Interview level created successfully: id=${level.id}, name=${level.name}, code=${level.code}`,
    );
    return AdminInterviewLevelMapper.toResponseDto(level);
  }

  /*
   * Lấy danh sách toàn bộ Interview Level cho Admin.
   * Service trả data và meta để Controller bọc bằng ApiResponseWithMeta.
   */
  async getLevels(): Promise<AdminInterviewLevelListResponseResult> {
    this.logger.log('Start retrieving interview levels');
    const { items, total } = await this.levelRepository.findAllWithTotal();
    return this.buildListResult(items, total, 'Interview levels retrieved');
  }

  /*
   * Lấy danh sách Interview Level đang active.
   */
  async getActiveLevels(): Promise<AdminInterviewLevelListResponseResult> {
    this.logger.log('Start retrieving active interview levels');
    const { items, total } = await this.levelRepository.findActiveWithTotal();
    return this.buildListResult(items, total, 'Active interview levels retrieved');
  }

  /*
   * Lấy danh sách Interview Level đang inactive.
   */
  async getInactiveLevels(): Promise<AdminInterviewLevelListResponseResult> {
    this.logger.log('Start retrieving inactive interview levels');
    const { items, total } = await this.levelRepository.findInactiveWithTotal();
    return this.buildListResult(
      items,
      total,
      'Inactive interview levels retrieved',
    );
  }

  /*
   * Cập nhật thông tin Interview Level.
   * Nếu đổi code thì kiểm tra trùng code với Level khác trước khi cập nhật.
   */
  async updateLevel(
    id: number,
    dto: UpdateInterviewLevelDto,
  ): Promise<AdminInterviewLevelResponseDto> {
    this.logger.log(`Start updating interview level: id=${id}`);
    await this.getLevelByIdOrThrow(id);
    if (dto.code) {
      await this.checkCodeUniqueness(dto.code, id);
    }
    const updatedLevel = await this.levelRepository.updateLevel(id, {
      name: dto.name,
      code: dto.code,
      description: dto.description,
      displayOrder: dto.displayOrder,
    });
    this.logger.log(
      `Interview level updated successfully: id=${updatedLevel.id}, name=${updatedLevel.name}, code=${updatedLevel.code}`,
    );
    return AdminInterviewLevelMapper.toResponseDto(updatedLevel);
  }

  /*
   * Kích hoạt Interview Level.
   * Level sau khi active sẽ được Candidate nhìn thấy và chọn khi tạo Interview Configuration.
   */
  async activateLevel(id: number): Promise<AdminInterviewLevelResponseDto> {
    this.logger.log(`Start activating interview level: id=${id}`);
    await this.getLevelByIdOrThrow(id);
    const activatedLevel = await this.levelRepository.activate(id);
    this.logger.log(
      `Interview level activated successfully: id=${activatedLevel.id}, code=${activatedLevel.code}`,
    );
    return AdminInterviewLevelMapper.toResponseDto(activatedLevel);
  }

  /*
   * Vô hiệu hóa Interview Level.
   * Không xóa cứng để tránh ảnh hưởng các Interview hoặc Configuration đã liên kết.
   */
  async deactivateLevel(id: number): Promise<AdminInterviewLevelResponseDto> {
    this.logger.log(`Start deactivating interview level: id=${id}`);
    await this.getLevelByIdOrThrow(id);
    const deactivatedLevel = await this.levelRepository.deactivate(id);
    this.logger.log(
      `Interview level deactivated successfully: id=${deactivatedLevel.id}, code=${deactivatedLevel.code}`,
    );
    return AdminInterviewLevelMapper.toResponseDto(deactivatedLevel);
  }

  /*
   * Xóa cứng Interview Level khi chưa được sử dụng trong interview/configuration.
   */
  async deleteLevel(id: number): Promise<AdminInterviewLevelResponseDto> {
    this.logger.log(`Start deleting interview level: id=${id}`);

    this.validateId(id);
    await this.getLevelByIdOrThrow(id);

    const usageCount = await this.levelRepository.countUsage(id);

    if (usageCount > 0) {
      this.logger.warn(
        `Delete level failed because it is in use: id=${id}, usageCount=${usageCount}`,
      );

      throw new ConflictException('Không thể xóa vì dữ liệu đang được sử dụng.');
    }

    const deletedLevel = await this.levelRepository.deleteLevel(id);

    this.logger.log(
      `Interview level deleted successfully: id=${deletedLevel.id}, code=${deletedLevel.code}`,
    );

    return AdminInterviewLevelMapper.toResponseDto(deletedLevel);
  }

  /*
   * Lấy Interview Level theo id.
   * Nếu không tồn tại thì throw NotFoundException để dừng flow xử lý.
   */
  private async getLevelByIdOrThrow(
    id: number,
  ): Promise<AdminInterviewLevelModel> {
    const level = await this.levelRepository.findById(id);
    if (!level) {
      this.logger.warn(`Action failed - Interview level not found: id=${id}`);

      throw new NotFoundException('Interview level not found');
    }
    return level;
  }

  /*
   * Gộp logic map danh sách Level sang response DTO kèm meta.
   */
  private buildListResult(
    items: AdminInterviewLevelModel[],
    total: number,
    logMessage: string,
  ): AdminInterviewLevelListResponseResult {
    const data = items.map(AdminInterviewLevelMapper.toResponseDto);
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
   * Kiểm tra code của Interview Level có bị trùng hay không.
   * Khi update thì currentId dùng để bỏ qua chính bản ghi đang cập nhật.
   */
  private async checkCodeUniqueness(
    code: string,
    currentId?: number,
  ): Promise<void> {
    const existedLevel = await this.levelRepository.findByCode(code);
    if (existedLevel && existedLevel.id !== currentId) {
      this.logger.warn(
        `Action failed - Interview level code already exists: code=${code}`,
      );
      throw new ConflictException('Interview level code already exists');
    }
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid interview level id');
    }
  }
}
