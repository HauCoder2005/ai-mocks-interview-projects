import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/responses/api-response.interface';
import { CurrentUserId } from 'src/shared/security/decorators/current-user-id.decorator';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import {
  ApiBadRequestErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/shared/swagger/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';
import { CandidateAudioAnswerResponseDto } from '../responses/candidate-audio-answer-response.dto';
import { CandidateAudioAnswerService } from '../services/candidate-audio-answer.service';
import type { CandidateAudioAnswerFileInput } from '../services/candidate-audio-answer.service';

@ApiTags('Candidate Interview Audio Answers')
@Controller('candidate/interviews')
@UseGuards(JwtAccessGuard)
@ApiAuth()
export class CandidateAudioAnswerController {
  constructor(
    private readonly candidateAudioAnswerService: CandidateAudioAnswerService,
  ) {}

  /**
   * Nhận audio answer của Candidate, lưu vào MinIO và trả transcript text.
   */
  @Post('sessions/:sessionId/answers/audio')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('audio'))
  @ApiOperation({ summary: 'Upload audio answer và nhận transcript' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['audio'],
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiSuccessResponse(
    CandidateAudioAnswerResponseDto,
    'Audio answer transcribed successfully',
  )
  @ApiBadRequestErrorResponse()
  @ApiUnauthorizedErrorResponse()
  async submitAudioAnswer(
    @CurrentUserId() userId: number,
    @Param('sessionId') sessionId: string,
    @UploadedFile() audioFile: CandidateAudioAnswerFileInput,
  ): Promise<ApiResponse<CandidateAudioAnswerResponseDto>> {
    const data = await this.candidateAudioAnswerService.submitAudioAnswer({
      userId,
      sessionId,
      audioFile,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Audio answer transcribed successfully',
      data,
    };
  }
}
