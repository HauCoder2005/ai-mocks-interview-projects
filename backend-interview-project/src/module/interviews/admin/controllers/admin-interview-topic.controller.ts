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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiResponse,
  ApiResponseWithMeta,
} from 'src/shared/responses/api-response.interface';
import { AdminRoleGuard } from 'src/shared/security/guards/admin-role.guard';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import {
  ApiBadRequestErrorResponse,
  ApiConflictErrorResponse,
  ApiNotFoundErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiFormBody } from 'src/shared/swagger/decorators/api-form-body.decorator';
import {
  ApiCreatedSuccessResponse,
  ApiListSuccessResponse,
  ApiSuccessResponse,
} from 'src/shared/swagger/decorators/api-success-response.decorator';

import { CreateInterviewTopicDto } from '../dtos/create-interview-topic.dto';
import { UpdateInterviewTopicDto } from '../dtos/update-interview-topic.dto';
import { AdminInterviewTopicResponseDto } from '../responses/admin-interview-topic-response.dto';
import { AdminInterviewTopicListResponseResult } from '../results/interview/topic/admin-interview-topic-list-response-result';
import { AdminInterviewTopicService } from '../services/admin-interview-topic.service';

@ApiTags('Admin Interview Topics')
@Controller('admin/interview-master-data/topics')
@UseGuards(JwtAccessGuard, AdminRoleGuard)
@ApiAuth()
export class AdminInterviewTopicController {
  /*
   * Inject AdminInterviewTopicService.
   * Controller chỉ nhận request, gọi service và chuẩn hóa response trả về client.
   */
  constructor(
    private readonly adminInterviewTopicService: AdminInterviewTopicService,
  ) {}

  /*
   * Tạo mới Interview Topic.
   * API này dành cho Admin quản lý master data Topic.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới Interview Topic' })
  @ApiFormBody(CreateInterviewTopicDto)
  @ApiCreatedSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Interview topic created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiConflictErrorResponse('Interview topic code already exists')
  async createTopic(
    @Body() dto: CreateInterviewTopicDto,
  ): Promise<ApiResponse<AdminInterviewTopicResponseDto>> {
    const data = await this.adminInterviewTopicService.createTopic(dto);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview topic created successfully',
      data,
    };
  }

  /*
   * Lấy danh sách toàn bộ Interview Topic.
   * API trả cả Topic đang active và inactive, kèm meta cho frontend.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Interview Topic' })
  @ApiListSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Interview topics retrieved successfully',
  )
  async getTopics(): Promise<
    ApiResponseWithMeta<
      AdminInterviewTopicResponseDto[],
      AdminInterviewTopicListResponseResult['meta']
    >
  > {
    const result = await this.adminInterviewTopicService.getTopics();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview topics retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Lấy danh sách Interview Topic đang active.
   * Admin dùng API này để xem các Topic đang được bật trong hệ thống.
   */
  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Interview Topic đang active' })
  @ApiListSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Active interview topics retrieved successfully',
  )
  async getActiveTopics(): Promise<
    ApiResponseWithMeta<
      AdminInterviewTopicResponseDto[],
      AdminInterviewTopicListResponseResult['meta']
    >
  > {
    const result = await this.adminInterviewTopicService.getActiveTopics();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active interview topics retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Lấy danh sách Interview Topic đang inactive.
   * Admin dùng API này để xem các Topic đã bị vô hiệu hóa.
   */
  @Get('inactive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Interview Topic inactive' })
  @ApiListSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Inactive interview topics retrieved successfully',
  )
  async getInactiveTopics(): Promise<
    ApiResponseWithMeta<
      AdminInterviewTopicResponseDto[],
      AdminInterviewTopicListResponseResult['meta']
    >
  > {
    const result = await this.adminInterviewTopicService.getInactiveTopics();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Inactive interview topics retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Cập nhật thông tin Interview Topic theo id.
   * API này chỉ cập nhật master data, không tác động tới Interview đã liên kết.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật Interview Topic' })
  @ApiFormBody(UpdateInterviewTopicDto)
  @ApiSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Interview topic updated successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiNotFoundErrorResponse('Interview topic not found')
  @ApiConflictErrorResponse('Interview topic code already exists')
  async updateTopic(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewTopicDto,
  ): Promise<ApiResponse<AdminInterviewTopicResponseDto>> {
    const data = await this.adminInterviewTopicService.updateTopic(id, dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview topic updated successfully',
      data,
    };
  }

  /*
   * Kích hoạt Interview Topic.
   * Sau khi active, Candidate có thể chọn Topic này khi cấu hình focus topics.
   */
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kích hoạt Interview Topic' })
  @ApiSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Interview topic activated successfully',
  )
  @ApiNotFoundErrorResponse('Interview topic not found')
  async activateTopic(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewTopicResponseDto>> {
    const data = await this.adminInterviewTopicService.activateTopic(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview topic activated successfully',
      data,
    };
  }

  /*
   * Vô hiệu hóa Interview Topic.
   * Không xóa cứng để tránh ảnh hưởng Interview hoặc Configuration đã liên kết.
   */
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vô hiệu hóa Interview Topic' })
  @ApiSuccessResponse(
    AdminInterviewTopicResponseDto,
    'Interview topic deactivated successfully',
  )
  @ApiNotFoundErrorResponse('Interview topic not found')
  async deactivateTopic(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewTopicResponseDto>> {
    const data = await this.adminInterviewTopicService.deactivateTopic(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview topic deactivated successfully',
      data,
    };
  }
}
