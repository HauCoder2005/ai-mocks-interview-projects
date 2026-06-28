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
import { CreateInterviewLevelDto } from '../dtos/create-interview-level.dto';
import { UpdateInterviewLevelDto } from '../dtos/update-interview-level.dto';
import { AdminInterviewLevelResponseDto } from '../responses/admin-interview-level-response.dto';
import { AdminInterviewLevelListResponseResult } from '../results/interview/level/admin-interview-level-list-response-result';
import { AdminInterviewLevelService } from '../services/admin-interview-level.service';

@ApiTags('Admin Interview Levels')
@Controller('admin/interview-master-data/levels')
@UseGuards(JwtAccessGuard, AdminRoleGuard)
@ApiAuth()
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
  @ApiOperation({ summary: 'Tạo mới Interview Level' })
  @ApiFormBody(CreateInterviewLevelDto)
  @ApiCreatedSuccessResponse(
    AdminInterviewLevelResponseDto,
    'Interview level created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiConflictErrorResponse('Interview level code already exists')
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
  @ApiOperation({ summary: 'Lấy danh sách Interview Level' })
  @ApiListSuccessResponse(
    AdminInterviewLevelResponseDto,
    'Interview levels retrieved successfully',
  )
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
  @ApiOperation({ summary: 'Cập nhật Interview Level' })
  @ApiFormBody(UpdateInterviewLevelDto)
  @ApiSuccessResponse(
    AdminInterviewLevelResponseDto,
    'Interview level updated successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiNotFoundErrorResponse('Interview level not found')
  @ApiConflictErrorResponse('Interview level code already exists')
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
  @ApiOperation({ summary: 'Kích hoạt Interview Level' })
  @ApiSuccessResponse(
    AdminInterviewLevelResponseDto,
    'Interview level activated successfully',
  )
  @ApiNotFoundErrorResponse('Interview level not found')
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
  @ApiOperation({ summary: 'Vô hiệu hóa Interview Level' })
  @ApiSuccessResponse(
    AdminInterviewLevelResponseDto,
    'Interview level deactivated successfully',
  )
  @ApiNotFoundErrorResponse('Interview level not found')
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
