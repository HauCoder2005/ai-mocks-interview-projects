import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateInterviewPositionDto } from '../dtos/create-interview-position.dto';
import { UpdateInterviewPositionDto } from '../dtos/update-interview-position.dto';
import { AdminInterviewPositionMapper } from '../mappers/admin-interview-position.mapper';
import { AdminInterviewPositionRepository } from '../repositories/admin-interview-position.repository';

@Injectable()
export class AdminInterviewMasterDataService {
  private readonly logger = new Logger(AdminInterviewMasterDataService.name);

  constructor(
    private readonly positionRepository: AdminInterviewPositionRepository,
  ) {}

  /**
   * Tạo Position mới cho hệ thống phỏng vấn.
   * Log ở đây để biết request đã thật sự đi vào service và lưu database hay chưa.
   */
  async createPosition(dto: CreateInterviewPositionDto) {
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

  /**
   * Lấy toàn bộ Position cho màn hình admin.
   * Log số lượng để kiểm tra database hiện tại có dữ liệu hay không.
   */
  async getPositions() {
    this.logger.log('Start getting interview positions');
    const positions = await this.positionRepository.findAll();
    this.logger.log(`Interview positions found: total=${positions.length}`);
    return positions.map(AdminInterviewPositionMapper.toResponseDto);
  }

  /**
   * Cập nhật Position.
   * Nếu đổi code thì kiểm tra trùng code với Position khác.
   */
  async updatePosition(id: number, dto: UpdateInterviewPositionDto) {
    this.logger.log(`Start updating interview position: id=${id}`);
    const position = await this.positionRepository.findById(id);
    if (!position) {
      this.logger.warn(`Update position failed because not found: id=${id}`);
      throw new NotFoundException('Interview position not found');
    }
    if (dto.code) {
      const existedPosition = await this.positionRepository.findByCode(dto.code);
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

  /**
   * Kích hoạt Position để Candidate có thể chọn khi tạo Interview Configuration.
   */
  async activatePosition(id: number) {
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

  /**
   * Vô hiệu hóa Position khỏi danh sách Candidate có thể chọn.
   * Không xóa cứng để tránh ảnh hưởng dữ liệu đã liên kết.
   */
  async deactivatePosition(id: number) {
    this.logger.log(`Start deactivating interview position: id=${id}`);

    const position = await this.positionRepository.findById(id);

    if (!position) {
      this.logger.warn(`Deactivate position failed because not found: id=${id}`);

      throw new NotFoundException('Interview position not found');
    }

    const deactivatedPosition = await this.positionRepository.deactivate(id);

    this.logger.log(
      `Interview position deactivated successfully: id=${deactivatedPosition.id}`,
    );

    return AdminInterviewPositionMapper.toResponseDto(deactivatedPosition);
  }
}