import { Injectable, Logger } from '@nestjs/common';
import { createListMeta } from 'src/shared/responses/api-response.interface';
import { CandidateInterviewTechnologyMapper } from '../mappers/candidate-interview-technology.mapper';
import { CandidateInterviewTechnologyRepository } from '../repositories/candidate-interview-technology.repository';
import { CandidateInterviewTechnologyOptionsResult } from '../results/interview-technology/candidate-interview-technology-options-result';

@Injectable()
export class CandidateInterviewTechnologyService {
  private readonly logger = new Logger(
    CandidateInterviewTechnologyService.name,
  );

  constructor(
    private readonly technologyRepository: CandidateInterviewTechnologyRepository,
  ) {}

  /*
   * Lấy danh sách Interview Technology đang active cho Candidate chọn.
   * Candidate chỉ được nhìn thấy Technology còn hoạt động.
   */
  async getActiveTechnologies(): Promise<CandidateInterviewTechnologyOptionsResult> {
    this.logger.log('Start retrieving active interview technologies');

    const { items, total } =
      await this.technologyRepository.findActiveWithTotal();

    const data = items.map(CandidateInterviewTechnologyMapper.toResponseDto);

    this.logger.log(
      `Active interview technologies retrieved successfully: total=${total}, itemCount=${data.length}`,
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
