import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWithMeta } from 'src/shared/responses/api-response.interface';
import { ApiListSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';
import { CandidateInterviewTechnologyResponseDto } from '../responses/candidate-interview-technology-response.dto';
import { CandidateInterviewTechnologyService } from '../services/candidate-interview-technology.service';
import { CandidateInterviewTechnologyOptionsResult } from '../results/interview-technology/candidate-interview-technology-options-result';

@ApiTags('Candidate Interview Technologies')
@Controller('interviews/options/technologies')
export class CandidateInterviewTechnologyController {
  private readonly logger = new Logger(
    CandidateInterviewTechnologyController.name,
  );

  /*
   * Inject CandidateInterviewTechnologyService.
   * Controller chỉ nhận request, gọi service và chuẩn hóa response trả về client.
   */
  constructor(
    private readonly candidateInterviewTechnologyService: CandidateInterviewTechnologyService,
  ) {}

  /*
   * Lấy danh sách Interview Technology đang active cho Candidate chọn.
   * Candidate chỉ nhìn thấy Technology còn hoạt động, không lấy Technology inactive.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Technology active cho Candidate' })
  @ApiListSuccessResponse(
    CandidateInterviewTechnologyResponseDto,
    'Interview technologies retrieved successfully',
  )
  async getActiveTechnologies(): Promise<
    ApiResponseWithMeta<
      CandidateInterviewTechnologyResponseDto[],
      CandidateInterviewTechnologyOptionsResult['meta']
    >
  > {
    this.logger.log('GET /interviews/options/technologies');

    const result =
      await this.candidateInterviewTechnologyService.getActiveTechnologies();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview technologies retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }
}
