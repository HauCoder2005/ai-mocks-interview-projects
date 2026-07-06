import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/responses/api-response.interface';
import { CurrentUserId } from 'src/shared/security/decorators/current-user-id.decorator';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import {
  ApiBadRequestErrorResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';
import { CandidateEvaluateAnswerRequestDto } from '../dtos/candidate-evaluate-answer-request.dto';
import { CandidateInterviewEvaluationResponseDto } from '../responses/candidate-interview-evaluation-response.dto';
import { CandidateInterviewEvaluationService } from '../services/candidate-interview-evaluation.service';

@ApiTags('Candidate Interview Agent')
@Controller('candidate/interviews')
@UseGuards(JwtAccessGuard)
@ApiAuth()
export class CandidateInterviewEvaluationController {
  constructor(
    private readonly candidateInterviewEvaluationService: CandidateInterviewEvaluationService,
  ) {}

  /**
   * Đánh giá câu trả lời bằng interview-agent-service qua backend.
   */
  @Post('sessions/:sessionId/agent/evaluate-answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate candidate answer with interview agent' })
  @ApiBody({ type: CandidateEvaluateAnswerRequestDto })
  @ApiSuccessResponse(
    CandidateInterviewEvaluationResponseDto,
    'Candidate answer evaluated successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse()
  @ApiNotFoundErrorResponse('Interview session not found or not in progress')
  async evaluateAnswer(
    @CurrentUserId() userId: number,
    @Param('sessionId') sessionId: string,
    @Body() dto: CandidateEvaluateAnswerRequestDto,
  ): Promise<ApiResponse<CandidateInterviewEvaluationResponseDto>> {
    const data = await this.candidateInterviewEvaluationService.evaluateAnswer({
      userId,
      sessionId: Number(sessionId),
      ...dto,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview answer evaluated successfully',
      data,
    };
  }
}
