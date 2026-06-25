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

import {
  ApiResponse,
  ApiResponseWithMeta,
} from 'src/shared/responses/api-response.interface';

import { CreateInterviewPositionDto } from '../dtos/create-interview-position.dto';
import { UpdateInterviewPositionDto } from '../dtos/update-interview-position.dto';
import { AdminInterviewPositionResponseDto } from '../responses/admin-interview-position-response.dto';
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
  async createPosition(
    @Body() dto: CreateInterviewPositionDto,
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log('POST /admin/interview-master-data/positions');

    const position =
      await this.adminInterviewMasterDataService.createPosition(dto);

    return {
      message: 'Interview position created successfully',
      data: position,
    };
  }

  /*
   * Lấy danh sách toàn bộ Interview Position.
   * Vì đây là GET list nên bắt buộc trả về meta gồm total và itemCount.
   */
  @Get('positions')
  async getPositions(): Promise<
    ApiResponseWithMeta<AdminInterviewPositionResponseDto[]>
  > {
    this.logger.log('GET /admin/interview-master-data/positions');

    const result = await this.adminInterviewMasterDataService.getPositions();

    return {
      message: 'Interview positions retrieved successfully',
      data: result.data,
      meta: result.meta,
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
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log(`PATCH /admin/interview-master-data/positions/${id}`);
    const position = await this.adminInterviewMasterDataService.updatePosition(
      id,
      dto,
    );
    return {
      message: 'Interview position updated successfully',
      data: position,
    };
  }

  /*
   * Kích hoạt một Interview Position.
   * Khi active, Candidate có thể chọn Position này để cấu hình phỏng vấn.
   */
  @Patch('positions/:id/activate')
  async activatePosition(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log(
      `PATCH /admin/interview-master-data/positions/${id}/activate`,
    );
    const position =
      await this.adminInterviewMasterDataService.activatePosition(id);
    return {
      message: 'Interview position activated successfully',
      data: position,
    };
  }

  /*
   * Vô hiệu hóa một Interview Position.
   * Không xóa cứng để tránh ảnh hưởng dữ liệu đã liên kết trước đó.
   */
  @Patch('positions/:id/deactivate')
  async deactivatePosition(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log(
      `PATCH /admin/interview-master-data/positions/${id}/deactivate`,
    );
    const position =
      await this.adminInterviewMasterDataService.deactivatePosition(id);

    return {
      message: 'Interview position deactivated successfully',
      data: position,
    };
  }
}
