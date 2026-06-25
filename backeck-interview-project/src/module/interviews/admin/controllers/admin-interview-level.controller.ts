import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiResponse,
  ApiResponseWithMeta,
} from 'src/shared/responses/api-response.interface';

import { CreateInterviewLevelDto } from '../dtos/create-interview-level.dto';
import { UpdateInterviewLevelDto } from '../dtos/update-interview-level.dto';
import { AdminInterviewLevelResponseDto } from '../responses/admin-interview-level-response.dto';
import { AdminInterviewLevelListResponseResult } from '../results/interview/level/admin-interview-level-list-response-result';
import { AdminInterviewLevelService } from '../services/admin-interview-level.service';

@Controller('admin/interview-master-data/levels')
export class AdminInterviewLevelController {
  /*
   * Inject AdminInterviewLevelService để controller chỉ điều phối request và response.
   */
  constructor(
    private readonly interviewLevelService: AdminInterviewLevelService,
  ) {}

  /*
   * Tạo mới Interview Level.
   * API này dành cho Admin quản lý master data Level.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLevel(
    @Body() dto: CreateInterviewLevelDto,
  ): Promise<ApiResponse<AdminInterviewLevelResponseDto>> {
    const data = await this.interviewLevelService.createLevel(dto);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview level created successfully',
      data,
    };
  }

  /*
   * Lấy danh sách toàn bộ Interview Level.
   * API trả kèm meta để frontend biết total và itemCount.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getLevels(): Promise<
    ApiResponseWithMeta<
      AdminInterviewLevelResponseDto[],
      AdminInterviewLevelListResponseResult['meta']
    >
  > {
    const result = await this.interviewLevelService.getLevels();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview levels retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Cập nhật thông tin Interview Level theo id.
   * API này chỉ cập nhật master data, không tác động tới Interview đã liên kết.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewLevelDto,
  ): Promise<ApiResponse<AdminInterviewLevelResponseDto>> {
    const data = await this.interviewLevelService.updateLevel(id, dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview level updated successfully',
      data,
    };
  }

  /*
   * Kích hoạt Interview Level.
   * Sau khi active, Candidate có thể chọn Level này khi tạo Interview Configuration.
   */
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activateLevel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewLevelResponseDto>> {
    const data = await this.interviewLevelService.activateLevel(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview level activated successfully',
      data,
    };
  }

  /*
   * Vô hiệu hóa Interview Level.
   * Không xóa cứng để tránh ảnh hưởng Interview hoặc Configuration đã liên kết.
   */
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateLevel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewLevelResponseDto>> {
    const data = await this.interviewLevelService.deactivateLevel(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview level deactivated successfully',
      data,
    };
  }
}
