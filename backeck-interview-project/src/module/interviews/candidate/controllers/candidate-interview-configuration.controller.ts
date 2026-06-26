import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiResponse } from 'src/shared/responses/api-response.interface';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { JwtAuthUser } from 'src/shared/security/token/jwt-payload.interface';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import {
  ApiBadRequestErrorResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiFormBody } from 'src/shared/swagger/decorators/api-form-body.decorator';
import { ApiCreatedSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';

import { CreateCandidateInterviewConfigurationDto } from '../dtos/create-candidate-interview-configuration.dto';
import { CandidateInterviewConfigurationResponseDto } from '../responses/candidate-interview-configuration-response.dto';
import { CandidateInterviewConfigurationService } from '../services/candidate-interview-configuration.service';

type AuthenticatedRequest = Request & {
  user?: JwtAuthUser;
};

@ApiTags('Candidate Interview Configurations')
@Controller('interviews/configurations')
@UseGuards(JwtAccessGuard)
@ApiAuth()
export class CandidateInterviewConfigurationController {
  /*
   * Inject CandidateInterviewConfigurationService.
   * Controller lấy user hiện tại từ request và chuẩn hóa response trả về client.
   */
  constructor(
    private readonly candidateInterviewConfigurationService: CandidateInterviewConfigurationService,
  ) {}

  /*
   * Tạo Interview Configuration cho Candidate đang đăng nhập.
   * API không nhận userId từ body để đảm bảo configuration thuộc đúng token hiện tại.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo Interview Configuration cho Candidate' })
  @ApiFormBody(CreateCandidateInterviewConfigurationDto)
  @ApiCreatedSuccessResponse(
    CandidateInterviewConfigurationResponseDto,
    'Interview configuration created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse()
  @ApiNotFoundErrorResponse('Interview master data not found or inactive')
  async createConfiguration(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateCandidateInterviewConfigurationDto,
  ): Promise<ApiResponse<CandidateInterviewConfigurationResponseDto>> {
    const userId = this.extractUserId(request);
    const data =
      await this.candidateInterviewConfigurationService.createConfiguration(
        userId,
        dto,
      );

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview configuration created successfully',
      data,
    };
  }

  /*
   * Lấy user id từ request.user do JwtAccessGuard gắn vào.
   * Nếu guard không gắn được user thì trả Unauthorized để dừng request.
   */
  private extractUserId(request: AuthenticatedRequest): number {
    if (!request.user?.id) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    return request.user.id;
  }
}
