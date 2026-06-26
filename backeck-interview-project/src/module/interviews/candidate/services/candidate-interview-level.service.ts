import { Injectable, Logger } from '@nestjs/common';
import { createListMeta } from 'src/shared/responses/api-response.interface';
import { CandidateInterviewLevelMapper } from '../mappers/candidate-interview-level.mapper';
import { CandidateInterviewLevelRepository } from '../repositories/candidate-interview-level.repository';
import { CandidateInterviewLevelOptionsResult } from '../results/interview-level/candidate-interview-level-options-result';

@Injectable()
export class CandidateInterviewLevelService {
  private readonly logger = new Logger(CandidateInterviewLevelService.name);

  /*
   * Inject CandidateInterviewLevelRepository để service lấy dữ liệu Level đang active.
   */
  constructor(
    private readonly levelRepository: CandidateInterviewLevelRepository,
  ) {}

  /*
   * Lấy danh sách Level đang active cho Candidate chọn.
   * Service map domain model sang response DTO và tạo meta cho API list.
   */
  async getActiveLevels(): Promise<CandidateInterviewLevelOptionsResult> {
    this.logger.log('Start retrieving active interview levels');
    const { items, total } = await this.levelRepository.findActiveWithTotal();
    const data = items.map(CandidateInterviewLevelMapper.toResponseDto);
    this.logger.log(
      `Active interview levels retrieved successfully: total=${total}, itemCount=${data.length}`,
    );
    return {
      data,
      meta: createListMeta({
        total,
        itemCount: data.length,
      }),
    };
  }
}
