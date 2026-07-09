import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { createListMeta } from 'src/shared/responses/api-response.interface';

import { CreateInterviewPositionDto } from '../dtos/create-interview-position.dto';
import { UpdateInterviewPositionDto } from '../dtos/update-interview-position.dto';
import { AdminInterviewPositionMapper } from '../mappers/admin-interview-position.mapper';
import { AdminInterviewPositionRepository } from '../repositories/admin-interview-position.repository';
import { AdminInterviewPositionResponseDto } from '../responses/admin-interview-position-response.dto';
import { AdminInterviewPositionListResponseResult } from '../results/interview/position/admin-interview-position-list-response-result';

@Injectable()
export class AdminInterviewMasterDataService {
  private readonly logger = new Logger(AdminInterviewMasterDataService.name);

  constructor(
    private readonly positionRepository: AdminInterviewPositionRepository,
  ) {}

  /*
   * Tạo Position mới cho hệ thống phỏng vấn.
   * Log ở đây để biết request đã thật sự đi vào service và lưu database hay chưa.
   */
  async createPosition(
    dto: CreateInterviewPositionDto,
  ): Promise<AdminInterviewPositionResponseDto> {
    this.logger.log(
      `Start creating interview position: name=${dto.name}, code=${dto.code}`,
    );

    const existedPosition = await this.positionRepository.findByCode(dto.code);

    if (existedPosition) {
      this.logger.warn(
        `Create position failed because code already exists: code=${dto.code}`,
      );

      throw new ConflictException('Interview position code already exists');
    }

    const position = await this.positionRepository.createPosition(dto);

    this.logger.log(
      `Interview position created successfully: id=${position.id}, name=${position.name}, code=${position.code}`,
    );

    return AdminInterviewPositionMapper.toResponseDto(position);
  }

  /*
   * Lấy toàn bộ Position cho màn hình admin.
   *
   * Repository trả về items + total.
   * Service map items sang ResponseDto rồi tạo meta cho ApiResponseWithMeta.
   *
   * GET danh sách thì luôn trả:
   * - data
   * - meta.total
   * - meta.itemCount
   */
  async getPositions(): Promise<AdminInterviewPositionListResponseResult> {
    this.logger.log('Start getting interview positions');

    const result = await this.positionRepository.findAllWithTotal();

    const positions = result.items.map(
      AdminInterviewPositionMapper.toResponseDto,
    );

    this.logger.log(`Interview positions found: total=${result.total}`);

    return {
      data: positions,
      meta: createListMeta({
        total: result.total,
        itemCount: positions.length,
      }),
    };
  }

  /*
   * Cập nhật Position.
   * Nếu đổi code thì kiểm tra trùng code với Position khác.
   */
  async updatePosition(
    id: number,
    dto: UpdateInterviewPositionDto,
  ): Promise<AdminInterviewPositionResponseDto> {
    this.logger.log(`Start updating interview position: id=${id}`);

    const position = await this.positionRepository.findById(id);

    if (!position) {
      this.logger.warn(`Update position failed because not found: id=${id}`);

      throw new NotFoundException('Interview position not found');
    }

    if (dto.code) {
      const existedPosition = await this.positionRepository.findByCode(
        dto.code,
      );

      if (existedPosition && existedPosition.id !== id) {
        this.logger.warn(
          `Update position failed because code already exists: id=${id}, code=${dto.code}`,
        );

        throw new ConflictException('Interview position code already exists');
      }
    }

    const updatedPosition = await this.positionRepository.updatePosition(
      id,
      dto,
    );

    this.logger.log(
      `Interview position updated successfully: id=${updatedPosition.id}, name=${updatedPosition.name}, code=${updatedPosition.code}`,
    );

    return AdminInterviewPositionMapper.toResponseDto(updatedPosition);
  }

  /*
   * Kích hoạt Position để Candidate có thể chọn khi tạo Interview Configuration.
   */
  async activatePosition(
    id: number,
  ): Promise<AdminInterviewPositionResponseDto> {
    this.logger.log(`Start activating interview position: id=${id}`);

    const position = await this.positionRepository.findById(id);

    if (!position) {
      this.logger.warn(`Activate position failed because not found: id=${id}`);

      throw new NotFoundException('Interview position not found');
    }

    const activatedPosition = await this.positionRepository.activate(id);

    this.logger.log(
      `Interview position activated successfully: id=${activatedPosition.id}`,
    );

    return AdminInterviewPositionMapper.toResponseDto(activatedPosition);
  }

  /*
   * Vô hiệu hóa Position khỏi danh sách Candidate có thể chọn.
   * Không xóa cứng để tránh ảnh hưởng dữ liệu đã liên kết.
   */
  async deactivatePosition(
    id: number,
  ): Promise<AdminInterviewPositionResponseDto> {
    this.logger.log(`Start deactivating interview position: id=${id}`);

    const position = await this.positionRepository.findById(id);

    if (!position) {
      this.logger.warn(
        `Deactivate position failed because not found: id=${id}`,
      );

      throw new NotFoundException('Interview position not found');
    }

    const deactivatedPosition = await this.positionRepository.deactivate(id);

    this.logger.log(
      `Interview position deactivated successfully: id=${deactivatedPosition.id}`,
    );

    return AdminInterviewPositionMapper.toResponseDto(deactivatedPosition);
  }

  /*
   * Xóa cứng Position khi chưa được sử dụng trong interview/configuration.
   */
  async deletePosition(
    id: number,
  ): Promise<AdminInterviewPositionResponseDto> {
    this.logger.log(`Start deleting interview position: id=${id}`);

    this.validateId(id);

    const position = await this.positionRepository.findById(id);

    if (!position) {
      this.logger.warn(`Delete position failed because not found: id=${id}`);

      throw new NotFoundException('Interview position not found');
    }

    const usageCount = await this.positionRepository.countUsage(id);

    if (usageCount > 0) {
      this.logger.warn(
        `Delete position failed because it is in use: id=${id}, usageCount=${usageCount}`,
      );

      throw new ConflictException('Không thể xóa vì dữ liệu đang được sử dụng.');
    }

    const deletedPosition = await this.positionRepository.deletePosition(id);

    this.logger.log(
      `Interview position deleted successfully: id=${deletedPosition.id}`,
    );

    return AdminInterviewPositionMapper.toResponseDto(deletedPosition);
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid interview position id');
    }
  }
}
