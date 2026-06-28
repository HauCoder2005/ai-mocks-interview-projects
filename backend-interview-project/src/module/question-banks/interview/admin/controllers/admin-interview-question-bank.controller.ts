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
  Req,
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
  ApiUnauthorizedErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiFormBody } from 'src/shared/swagger/decorators/api-form-body.decorator';
import {
  ApiCreatedSuccessResponse,
  ApiListSuccessResponse,
  ApiSuccessResponse,
} from 'src/shared/swagger/decorators/api-success-response.decorator';
import { CreateInterviewQuestionBankDto } from '../dtos/create-interview-question-bank.dto';
import { UpdateInterviewQuestionBankDto } from '../dtos/update-interview-question-bank.dto';
import { AdminInterviewQuestionBankResponseDto } from '../responses/admin-interview-question-bank-response.dto';
import { AdminInterviewQuestionBankListResponseResult } from '../results/interview-question-bank/admin-interview-question-bank-list-response-result';
import { AdminInterviewQuestionBankService } from '../services/admin-interview-question-bank.service';

@ApiTags('Admin Interview Question Banks')
@Controller('admin/interview-question-banks')
@UseGuards(JwtAccessGuard, AdminRoleGuard)
@ApiAuth()
export class AdminInterviewQuestionBankController {
  /*
   * Inject AdminInterviewQuestionBankService.
   * Controller chỉ nhận request, lấy user hiện tại và chuẩn hóa response.
   */
  constructor(
    private readonly adminInterviewQuestionBankService: AdminInterviewQuestionBankService,
  ) {}

  /*
   * Tạo câu hỏi mới trong Interview Question Bank.
   * created_by lấy từ access token, không nhận từ request body.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo câu hỏi trong Interview Question Bank' })
  @ApiFormBody(CreateInterviewQuestionBankDto)
  @ApiCreatedSuccessResponse(
    AdminInterviewQuestionBankResponseDto,
    'Interview question bank created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse()
  async createQuestionBank(
    @Req() request: any,
    @Body() dto: CreateInterviewQuestionBankDto,
  ): Promise<ApiResponse<AdminInterviewQuestionBankResponseDto>> {
    const adminUserId = request.user.id;

    const data =
      await this.adminInterviewQuestionBankService.createQuestionBank(
        adminUserId,
        dto,
      );

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview question bank created successfully',
      data,
    };
  }

  /*
   * Lấy danh sách câu hỏi Interview Question Bank.
   * Response list có data và meta nằm cùng cấp top-level.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách câu hỏi Interview Question Bank' })
  @ApiListSuccessResponse(
    AdminInterviewQuestionBankResponseDto,
    'Interview question banks retrieved successfully',
  )
  @ApiUnauthorizedErrorResponse()
  async getQuestionBanks(): Promise<
    ApiResponseWithMeta<
      AdminInterviewQuestionBankResponseDto[],
      AdminInterviewQuestionBankListResponseResult['meta']
    >
  > {
    const result =
      await this.adminInterviewQuestionBankService.getQuestionBanks();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview question banks retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Lấy chi tiết một câu hỏi Interview Question Bank theo id.
   * API trả response đã map camelCase, không trả raw Prisma relation.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết câu hỏi Interview Question Bank' })
  @ApiSuccessResponse(
    AdminInterviewQuestionBankResponseDto,
    'Interview question bank retrieved successfully',
  )
  @ApiUnauthorizedErrorResponse()
  @ApiNotFoundErrorResponse('Interview question bank not found')
  async getQuestionBankById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewQuestionBankResponseDto>> {
    const data =
      await this.adminInterviewQuestionBankService.getQuestionBankById(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview question bank retrieved successfully',
      data,
    };
  }

  /*
   * Cập nhật câu hỏi Interview Question Bank theo id.
   * Nếu body có options thì hệ thống replace toàn bộ options cũ.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật câu hỏi Interview Question Bank' })
  @ApiFormBody(UpdateInterviewQuestionBankDto)
  @ApiSuccessResponse(
    AdminInterviewQuestionBankResponseDto,
    'Interview question bank updated successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse()
  @ApiNotFoundErrorResponse('Interview question bank not found')
  async updateQuestionBank(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewQuestionBankDto,
  ): Promise<ApiResponse<AdminInterviewQuestionBankResponseDto>> {
    const data =
      await this.adminInterviewQuestionBankService.updateQuestionBank(id, dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview question bank updated successfully',
      data,
    };
  }

  /*
   * Xóa câu hỏi Interview Question Bank theo id.
   * API sẽ trả Conflict nếu câu hỏi đã được dùng trong interview session.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa câu hỏi Interview Question Bank' })
  @ApiSuccessResponse(
    AdminInterviewQuestionBankResponseDto,
    'Interview question bank deleted successfully',
  )
  @ApiUnauthorizedErrorResponse()
  @ApiNotFoundErrorResponse('Interview question bank not found')
  @ApiConflictErrorResponse('Interview question bank is already used')
  async deleteQuestionBank(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AdminInterviewQuestionBankResponseDto>> {
    const data =
      await this.adminInterviewQuestionBankService.deleteQuestionBank(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview question bank deleted successfully',
      data,
    };
  }
}
