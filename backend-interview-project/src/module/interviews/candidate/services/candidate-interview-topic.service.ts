import { Injectable, Logger } from '@nestjs/common';

import { createListMeta } from 'src/shared/responses/api-response.interface';

import { CandidateInterviewTopicMapper } from '../mappers/candidate-interview-topic.mapper';
import { CandidateInterviewTopicRepository } from '../repositories/candidate-interview-topic.repository';
import { CandidateInterviewTopicOptionsResult } from '../results/interview-topic/candidate-interview-topic-options-result';

@Injectable()
export class CandidateInterviewTopicService {
  private readonly logger = new Logger(CandidateInterviewTopicService.name);

  /*
   * Inject CandidateInterviewTopicRepository để Service lấy options cho Candidate.
   */
  constructor(
    private readonly topicRepository: CandidateInterviewTopicRepository,
  ) {}

  /*
   * Lấy danh sách Interview Topic đang active cho Candidate chọn.
   * Candidate chỉ được nhìn thấy Topic còn hoạt động.
   */
  async getActiveTopics(): Promise<CandidateInterviewTopicOptionsResult> {
    this.logger.log('Start retrieving active interview topics');

    const { items, total } = await this.topicRepository.findActiveWithTotal();

    const data = items.map((item) =>
      CandidateInterviewTopicMapper.toResponseDto(item),
    );

    this.logger.log(
      `Active interview topics retrieved successfully: total=${total}, itemCount=${data.length}`,
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
