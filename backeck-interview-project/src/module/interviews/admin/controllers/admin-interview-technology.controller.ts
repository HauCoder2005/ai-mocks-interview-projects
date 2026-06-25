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

import { CreateInterviewTechnologyDto } from '../dtos/create-interview-technology.dto';
import { UpdateInterviewTechnologyDto } from '../dtos/update-interview-technology.dto';
import { AdminInterviewTechnologyResponseDto } from '../responses/admin-interview-technology-response.dto';
import { AdminInterviewTechnologyListResponseResult } from '../results/interview/technology/admin-interview-technology-list-response-result';
import { AdminInterviewTechnologyService } from '../services/admin-interview-technology.service';

@Controller('admin/interview-master-data/technologies')
export class AdminInterviewTechnologyController {
  /*
   * Inject AdminInterviewTechnologyService.
   * Controller chỉ nhận request, gọi service và chuẩn hóa response trả về client.
   */
  constructor(
    private readonly adminInterviewTechnologyService: AdminInterviewTechnologyService,
  ) {}

  /*
   * Tạo mới Interview Technology.
   * API này dành cho Admin quản lý master data Technology.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTechnology(
    @Body() dto: CreateInterviewTechnologyDto,
  ): Promise<ApiResponse<AdminInterviewTechnologyResponseDto>> {
    const data =
      await this.adminInterviewTechnologyService.createTechnology(dto);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview technology created successfully',
      data,
    };
  }

  /*
   * Lấy danh sách toàn bộ Interview Technology.
   * API trả cả Technology đang active và inactive, kèm meta cho frontend.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTechnologies(): Promise<
    ApiResponseWithMeta<
      AdminInterviewTechnologyResponseDto[],
      AdminInterviewTechnologyListResponseResult['meta']
    >
  > {
    const result = await this.adminInterviewTechnologyService.getTechnologies();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview technologies retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Lấy danh sách Interview Technology đang active.
   * Admin dùng API này để xem các Technology đang được bật trong hệ thống.
   */
  @Get('active')
  @HttpCode(HttpStatus.OK)
  async getActiveTechnologies(): Promise<
    ApiResponseWithMeta<
      AdminInterviewTechnologyResponseDto[],
      AdminInterviewTechnologyListResponseResult['meta']
    >
  > {
    const result =
      await this.adminInterviewTechnologyService.getActiveTechnologies();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active interview technologies retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Lấy danh sách Interview Technology đang inactive.
   * Admin dùng API này để xem các Technology đã bị vô hiệu hóa.
   */
  @Get('inactive')
  @HttpCode(HttpStatus.OK)
  async getInactiveTechnologies(): Promise<
    ApiResponseWithMeta<
      AdminInterviewTechnologyResponseDto[],
      AdminInterviewTechnologyListResponseResult['meta']
    >
  > {
    const result =
      await this.adminInterviewTechnologyService.getInactiveTechnologies();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Inactive interview technologies retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Cập nhật thông tin Interview Technology theo id.
   * API này chỉ cập nhật master data, không tác động tới Interview đã liên kết.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTechnology(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewTechnologyDto,
  ): Promise<ApiResponse<AdminInterviewTechnologyResponseDto>> {
    const data = await this.adminInterviewTechnologyService.updateTechnology(
      id,
      dto,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview technology updated successfully',
      data,
    };
  }

  /*
   * Kích hoạt Interview Technology.
   * Sau khi active, Candidate có thể chọn Technology này khi cấu hình Interview.
   */
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activateTechnology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewTechnologyResponseDto>> {
    const data =
      await this.adminInterviewTechnologyService.activateTechnology(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview technology activated successfully',
      data,
    };
  }

  /*
   * Vô hiệu hóa Interview Technology.
   * Không xóa cứng để tránh ảnh hưởng Interview hoặc Configuration đã liên kết.
   */
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateTechnology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewTechnologyResponseDto>> {
    const data =
      await this.adminInterviewTechnologyService.deactivateTechnology(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview technology deactivated successfully',
      data,
    };
  }
}
