import { Controller, Get, Logger } from '@nestjs/common';

import { CandidateInterviewOptionsService } from '../services/candidate-interview-options.service';

@Controller('interviews/options')
export class CandidateInterviewOptionsController {
  private readonly logger = new Logger(CandidateInterviewOptionsController.name);

  constructor(
    private readonly candidateInterviewOptionsService: CandidateInterviewOptionsService,
  ) {}

  /*
   * Lấy danh sách Position đang active cho Candidate chọn.
   * API này chỉ phục vụ màn hình chọn cấu hình phỏng vấn, không dùng để quản trị master data.
   */
  @Get('positions')
  async getActivePositions() {
    this.logger.log('GET /interviews/options/positions');
    const positions = await this.candidateInterviewOptionsService.getActivePositions();
    return {
      success: true,
      message: 'Interview positions retrieved successfully',
      data: positions,
    };
  }
}