import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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

import { CreateInterviewPositionDto } from '../dtos/create-interview-position.dto';
import { UpdateInterviewPositionDto } from '../dtos/update-interview-position.dto';
import { AdminInterviewPositionResponseDto } from '../responses/admin-interview-position-response.dto';
import { AdminInterviewMasterDataService } from '../services/admin-interview-master-data.service';

@ApiTags('Admin Interview Positions')
@Controller('admin/interview-master-data')
@UseGuards(JwtAccessGuard, AdminRoleGuard)
@ApiAuth()
export class AdminInterviewMasterDataController {
  private readonly logger = new Logger(AdminInterviewMasterDataController.name);

  /*
   * Inject AdminInterviewMasterDataService để controller chỉ điều phối request và response.
   */
  constructor(
    private readonly adminInterviewMasterDataService: AdminInterviewMasterDataService,
  ) {}

  /*
   * Tạo mới một Interview Position.
   * Admin dùng API này để thêm vị trí phỏng vấn vào master data.
   */
  @Post('positions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới Interview Position' })
  @ApiFormBody(CreateInterviewPositionDto)
  @ApiCreatedSuccessResponse(
    AdminInterviewPositionResponseDto,
    'Interview position created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiConflictErrorResponse('Interview position code already exists')
  async createPosition(
    @Body() dto: CreateInterviewPositionDto,
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log('POST /admin/interview-master-data/positions');

    const position =
      await this.adminInterviewMasterDataService.createPosition(dto);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview position created successfully',
      data: position,
    };
  }

  /*
   * Lấy danh sách toàn bộ Interview Position.
   * Vì đây là GET list nên bắt buộc trả về meta gồm total và itemCount.
   */
  @Get('positions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Interview Position' })
  @ApiListSuccessResponse(
    AdminInterviewPositionResponseDto,
    'Interview positions retrieved successfully',
  )
  async getPositions(): Promise<
    ApiResponseWithMeta<AdminInterviewPositionResponseDto[]>
  > {
    this.logger.log('GET /admin/interview-master-data/positions');

    const result = await this.adminInterviewMasterDataService.getPositions();

    return {
      success: true,
      statusCode: HttpStatus.OK,
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật Interview Position' })
  @ApiFormBody(UpdateInterviewPositionDto)
  @ApiSuccessResponse(
    AdminInterviewPositionResponseDto,
    'Interview position updated successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiNotFoundErrorResponse('Interview position not found')
  @ApiConflictErrorResponse('Interview position code already exists')
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
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview position updated successfully',
      data: position,
    };
  }

  /*
   * Kích hoạt một Interview Position.
   * Khi active, Candidate có thể chọn Position này để cấu hình phỏng vấn.
   */
  @Patch('positions/:id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kích hoạt Interview Position' })
  @ApiSuccessResponse(
    AdminInterviewPositionResponseDto,
    'Interview position activated successfully',
  )
  @ApiNotFoundErrorResponse('Interview position not found')
  async activatePosition(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log(
      `PATCH /admin/interview-master-data/positions/${id}/activate`,
    );

    const position =
      await this.adminInterviewMasterDataService.activatePosition(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview position activated successfully',
      data: position,
    };
  }

  /*
   * Vô hiệu hóa một Interview Position.
   * Không xóa cứng để tránh ảnh hưởng dữ liệu đã liên kết trước đó.
   */
  @Patch('positions/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vô hiệu hóa Interview Position' })
  @ApiSuccessResponse(
    AdminInterviewPositionResponseDto,
    'Interview position deactivated successfully',
  )
  @ApiNotFoundErrorResponse('Interview position not found')
  async deactivatePosition(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewPositionResponseDto>> {
    this.logger.log(
      `PATCH /admin/interview-master-data/positions/${id}/deactivate`,
    );

    const position =
      await this.adminInterviewMasterDataService.deactivatePosition(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview position deactivated successfully',
      data: position,
    };
  }
}
