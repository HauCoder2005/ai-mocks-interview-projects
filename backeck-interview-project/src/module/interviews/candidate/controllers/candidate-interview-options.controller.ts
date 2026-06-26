import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseWithMeta } from 'src/shared/responses/api-response.interface';
import { ApiListSuccessResponse } from 'src/shared/swagger/decorators/api-success-response.decorator';

import { CandidateInterviewPositionResponseDto } from '../responses/candidate-interview-position-response.dto';
import { CandidateInterviewPositionOptionsResult } from '../results/interview-position/candidate-interview-position-options-result';
import { CandidateInterviewOptionsService } from '../services/candidate-interview-options.service';
import { CandidateInterviewLevelService } from '../services/candidate-interview-level.service';
import { CandidateInterviewLevelResponseDto } from '../responses/candidate-interview-level-response.dto';
import { CandidateInterviewLevelOptionsResult } from '../results/interview-level/candidate-interview-level-options-result';

@ApiTags('Candidate Interview Positions')
@Controller('interviews/options')
export class CandidateInterviewOptionsController {
  private readonly logger = new Logger(
    CandidateInterviewOptionsController.name,
  );

  /*
   * Inject CandidateInterviewOptionsService để controller chỉ điều phối request và response.
   */
  constructor(
    private readonly candidateInterviewOptionsService: CandidateInterviewOptionsService,
    private readonly candidateInterviewLevelService: CandidateInterviewLevelService,
  ) {}

  /*
   * Lấy danh sách Position đang active cho Candidate chọn.
   * API này chỉ phục vụ màn hình chọn cấu hình phỏng vấn, không dùng để quản trị master data.
   */
  @Get('positions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách Position active cho Candidate' })
  @ApiListSuccessResponse(
    CandidateInterviewPositionResponseDto,
    'Interview positions retrieved successfully',
  )
  async getActivePositions(): Promise<
    ApiResponseWithMeta<
      CandidateInterviewPositionResponseDto[],
      CandidateInterviewPositionOptionsResult['meta']
    >
  > {
    this.logger.log('GET /interviews/options/positions');

    const result =
      await this.candidateInterviewOptionsService.getActivePositions();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview positions retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /*
   * Lấy danh sách Interview Level đang active cho Candidate chọn.
   * API này chỉ phục vụ màn hình cấu hình phỏng vấn, không dùng để quản trị master data.
   */
  @Get('levels')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Candidate Interview Levels')
  @ApiOperation({ summary: 'Lấy danh sách Level active cho Candidate' })
  @ApiListSuccessResponse(
    CandidateInterviewLevelResponseDto,
    'Interview levels retrieved successfully',
  )
  async getActiveLevels(): Promise<
    ApiResponseWithMeta<
      CandidateInterviewLevelResponseDto[],
      CandidateInterviewLevelOptionsResult['meta']
    >
  > {
    this.logger.log('GET /interviews/options/levels');
    const result = await this.candidateInterviewLevelService.getActiveLevels();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview levels retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }
}
