import { Injectable, Logger } from '@nestjs/common';
import { createListMeta } from 'src/shared/responses/api-response.interface';
import { CandidateInterviewPositionMapper } from '../mappers/candidate-interview-position.mapper';
import { CandidateInterviewPositionRepository } from '../repositories/candidate-interview-position.repository';
import { CandidateInterviewPositionOptionsResult } from '../results/candidate-interview-position-options-result';

@Injectable()
export class CandidateInterviewOptionsService {
  private readonly logger = new Logger(CandidateInterviewOptionsService.name);

  constructor(
    private readonly positionRepository: CandidateInterviewPositionRepository,
  ) {}

  /*
   * Lấy danh sách Position cho Candidate chọn khi cấu hình phỏng vấn.
   *
   * Repository trả về items + total.
   * Service map items sang ResponseDto rồi tạo meta theo format ApiResponseWithMeta.
   *
   * Chỉ lấy Position đang active để user không chọn nhầm dữ liệu đã bị admin tắt.
   */
  async getActivePositions(): Promise<CandidateInterviewPositionOptionsResult> {
    this.logger.log('Start getting active interview positions for candidate');
    const result = await this.positionRepository.findActiveWithTotal();
    const positions = result.items.map(
      CandidateInterviewPositionMapper.toResponseDto,
    );
    this.logger.log(`Active interview positions found: total=${result.total}`);
    return {
      data: positions,
      meta: createListMeta({
        total: result.total,
        itemCount: positions.length,
      }),
    };
  }
}