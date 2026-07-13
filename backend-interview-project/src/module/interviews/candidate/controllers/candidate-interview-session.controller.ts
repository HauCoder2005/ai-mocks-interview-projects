import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/responses/api-response.interface';
import { CurrentUserId } from 'src/shared/security/decorators/current-user-id.decorator';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import {
  ApiBadRequestErrorResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiFormBody } from 'src/shared/swagger/decorators/api-form-body.decorator';
import { ApiCreatedSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';
import { StartCandidateInterviewSessionDto } from '../dtos/start-candidate-interview-session.dto';
import { CandidateInterviewSessionResponseDto } from '../responses/candidate-interview-session-response.dto';
import { CandidateInterviewSessionService } from '../services/candidate-interview-session.service';

@ApiTags('Candidate Interview Sessions')
@Controller('candidate/interviews/sessions')
@UseGuards(JwtAccessGuard)
@ApiAuth()
export class CandidateInterviewSessionController {
  constructor(
    private readonly candidateInterviewSessionService: CandidateInterviewSessionService,
  ) {}

  /**
   * Tạo phiên phỏng vấn mới để Candidate có sessionId trước khi gửi answer.
   */
  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create pending Interview Session for Candidate' })
  @ApiFormBody(StartCandidateInterviewSessionDto)
  @ApiCreatedSuccessResponse(
    CandidateInterviewSessionResponseDto,
    'Interview session created successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse()
  @ApiNotFoundErrorResponse('Interview master data not found or inactive')
  async startInterviewSession(
    @CurrentUserId() userId: number,
    @Body() dto: StartCandidateInterviewSessionDto,
  ): Promise<ApiResponse<CandidateInterviewSessionResponseDto>> {
    const data =
      await this.candidateInterviewSessionService.startInterviewSession(
        userId,
        dto,
      );

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Interview session created successfully',
      data,
    };
  }
}
