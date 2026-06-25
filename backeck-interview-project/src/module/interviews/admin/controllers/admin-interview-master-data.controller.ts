import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInterviewPositionDto } from '../dtos/create-interview-position.dto';
import { UpdateInterviewPositionDto } from '../dtos/update-interview-position.dto';
import { AdminInterviewMasterDataService } from '../services/admin-interview-master-data.service';

@Controller('admin/interview-master-data')
export class AdminInterviewMasterDataController {
  private readonly logger = new Logger(AdminInterviewMasterDataController.name);

  constructor(
    private readonly adminInterviewMasterDataService: AdminInterviewMasterDataService,
  ) {}

  /*
   * Tạo mới một Interview Position.
   * Admin dùng API này để thêm vị trí phỏng vấn vào master data.
   */
  @Post('positions')
  async createPosition(@Body() dto: CreateInterviewPositionDto) {
    this.logger.log('POST /admin/interview-master-data/positions');
    const position = await this.adminInterviewMasterDataService.createPosition(dto);
    return {
      success: true,
      message: 'Interview position created successfully',
      data: position,
    };
  }

  /*
   * Lấy danh sách toàn bộ Interview Position.
   * Admin dùng API này để xem và quản lý các vị trí phỏng vấn.
   */
  @Get('positions')
  async getPositions() {
    this.logger.log('GET /admin/interview-master-data/positions');
    const positions = await this.adminInterviewMasterDataService.getPositions();
    return {
      success: true,
      message: 'Interview positions retrieved successfully',
      data: positions,
    };
  }

  /*
   * Cập nhật thông tin một Interview Position.
   * Admin dùng API này để đổi tên, code hoặc mô tả của vị trí phỏng vấn.
   */
  @Patch('positions/:id')
  async updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewPositionDto,
  ) {
    this.logger.log(`PATCH /admin/interview-master-data/positions/${id}`);
    const position = await this.adminInterviewMasterDataService.updatePosition(id, dto);
    return {
      success: true,
      message: 'Interview position updated successfully',
      data: position,
    };
  }

  /*
   * Kích hoạt một Interview Position.
   * Khi active, Candidate có thể chọn Position này để cấu hình phỏng vấn.
   */
  @Patch('positions/:id/activate')
  async activatePosition(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(
      `PATCH /admin/interview-master-data/positions/${id}/activate`,
    );
    const position = await this.adminInterviewMasterDataService.activatePosition(id);
    return {
      success: true,
      message: 'Interview position activated successfully',
      data: position,
    };
  }

  /*
   * Vô hiệu hóa một Interview Position.
   * Không xóa cứng để tránh ảnh hưởng dữ liệu đã liên kết trước đó.
   */
  @Patch('positions/:id/deactivate')
  async deactivatePosition(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(
      `PATCH /admin/interview-master-data/positions/${id}/deactivate`,
    );
    const position = await this.adminInterviewMasterDataService.deactivatePosition(id);
    return {
      success: true,
      message: 'Interview position deactivated successfully',
      data: position,
    };
  }
}