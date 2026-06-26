import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseWithMeta } from 'src/shared/responses/api-response.interface';
import { ApiListSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';

import { CandidateInterviewTopicResponseDto } from '../responses/candidate-interview-topic-response.dto';
import { CandidateInterviewTopicOptionsResult } from '../results/interview-topic/candidate-interview-topic-options-result';
import { CandidateInterviewTopicService } from '../services/candidate-interview-topic.service';

@ApiTags('Candidate Interview Topics')
@Controller('interviews/options/topics')
export class CandidateInterviewTopicController {
  private readonly logger = new Logger(CandidateInterviewTopicController.name);

  /*
   * Inject CandidateInterviewTopicService.
   * Controller chỉ nhận request, gọi service và chuẩn hóa response trả về client.
   */
  constructor(
    private readonly candidateInterviewTopicService: CandidateInterviewTopicService,
  ) {}

  /*
   * Lấy danh sách Interview Topic đang active cho Candidate chọn.
   * Candidate chỉ nhìn thấy Topic còn hoạt động, không lấy Topic inactive.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Topic active cho Candidate' })
  @ApiListSuccessResponse(
    CandidateInterviewTopicResponseDto,
    'Interview topics retrieved successfully',
  )
  async getActiveTopics(): Promise<
    ApiResponseWithMeta<
      CandidateInterviewTopicResponseDto[],
      CandidateInterviewTopicOptionsResult['meta']
    >
  > {
    this.logger.log('GET /interviews/options/topics');

    const result = await this.candidateInterviewTopicService.getActiveTopics();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview topics retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }
}
