import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

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

import { CreateInterviewTechnologyDto } from '../dtos/create-interview-technology.dto';
import { UpdateInterviewTechnologyDto } from '../dtos/update-interview-technology.dto';
import { AdminInterviewTechnologyResponseDto } from '../responses/admin-interview-technology-response.dto';
import { AdminInterviewTechnologyListResponseResult } from '../results/interview/technology/admin-interview-technology-list-response-result';
import { AdminInterviewTechnologyService } from '../services/admin-interview-technology.service';

@ApiTags('Admin Interview Technologies')
@Controller('admin/interview-master-data/technologies')
@UseGuards(JwtAccessGuard, AdminRoleGuard)
@ApiAuth()
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
  @ApiOperation({ summary: 'Tạo mới Interview Technology' })
  @ApiFormBody(CreateInterviewTechnologyDto)
  @ApiCreatedSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Interview technology created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiConflictErrorResponse('Interview technology code or slug already exists')
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
  @ApiOperation({ summary: 'Lấy danh sách Interview Technology' })
  @ApiListSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Interview technologies retrieved successfully',
  )
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
  @ApiOperation({ summary: 'Lấy danh sách Interview Technology đang active' })
  @ApiListSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Active interview technologies retrieved successfully',
  )
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
  @ApiOperation({ summary: 'Lấy danh sách Interview Technology inactive' })
  @ApiListSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Inactive interview technologies retrieved successfully',
  )
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
  @ApiOperation({ summary: 'Cập nhật Interview Technology' })
  @ApiFormBody(UpdateInterviewTechnologyDto)
  @ApiSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Interview technology updated successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiNotFoundErrorResponse('Interview technology not found')
  @ApiConflictErrorResponse('Interview technology code or slug already exists')
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
  @ApiOperation({ summary: 'Kích hoạt Interview Technology' })
  @ApiSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Interview technology activated successfully',
  )
  @ApiNotFoundErrorResponse('Interview technology not found')
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
  @ApiOperation({ summary: 'Vô hiệu hóa Interview Technology' })
  @ApiSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Interview technology deactivated successfully',
  )
  @ApiNotFoundErrorResponse('Interview technology not found')
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

  /*
   * Xóa cứng Interview Technology nếu chưa có dữ liệu liên kết.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa Interview Technology' })
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(
    AdminInterviewTechnologyResponseDto,
    'Interview technology deleted successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiNotFoundErrorResponse('Interview technology not found')
  @ApiConflictErrorResponse('Không thể xóa vì dữ liệu đang được sử dụng.')
  async deleteTechnology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewTechnologyResponseDto>> {
    const data =
      await this.adminInterviewTechnologyService.deleteTechnology(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview technology deleted successfully',
      data,
    };
  }
}
