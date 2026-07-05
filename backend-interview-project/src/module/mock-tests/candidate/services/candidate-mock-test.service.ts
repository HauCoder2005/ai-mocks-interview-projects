import { Injectable } from '@nestjs/common';

import { MockTestMapper } from '../../mappers/mock-test.mapper';
import { MockTestRepository } from '../../repositories/mock-test.repository';
import { MockTestQueryDto } from '../../admin/dtos/mock-test-query.dto';
import { SubmitMockTestAnswerDto } from '../dtos/submit-mock-test-answer.dto';

@Injectable()
export class CandidateMockTestService {
  constructor(private readonly mockTestRepository: MockTestRepository) {}

  async getPublishedMockTests(query: MockTestQueryDto) {
    const result = await this.mockTestRepository.findPublished(query);

    return {
      data: result.items.map((item) => MockTestMapper.toListItem(item)),
      meta: result.meta,
    };
  }

  async getPublishedMockTestBySlug(slug: string) {
    const mockTest = await this.mockTestRepository.findPublishedBySlug(slug);

    if (!mockTest) {
      return null;
    }

    return MockTestMapper.toDetail(mockTest);
  }

  async startAttempt(userId: number, mockTestId: number) {
    const attempt = await this.mockTestRepository.startAttempt(
      userId,
      mockTestId,
    );

    return MockTestMapper.toAttempt(attempt);
  }

  async getAttempt(userId: number, attemptId: number) {
    const attempt = await this.mockTestRepository.findAttemptForUser(
      userId,
      attemptId,
    );

    return MockTestMapper.toAttemptDetail(attempt);
  }

  async saveAnswer(
    userId: number,
    attemptId: number,
    dto: SubmitMockTestAnswerDto,
  ) {
    const answer = await this.mockTestRepository.saveAnswer(
      userId,
      attemptId,
      dto.questionBankId,
      dto.selectedOptionId,
    );

    return MockTestMapper.toAnswer(answer);
  }

  async submitAttempt(userId: number, attemptId: number) {
    const attempt = await this.mockTestRepository.submitAttempt(
      userId,
      attemptId,
    );

    return MockTestMapper.toSubmitResult(attempt);
  }

  async getResult(userId: number, attemptId: number) {
    const attempt = await this.mockTestRepository.findCompletedResultForUser(
      userId,
      attemptId,
    );

    return MockTestMapper.toResult(attempt);
  }

  async getMyAttempts(userId: number) {
    const attempts = await this.mockTestRepository.findAttemptsForUser(userId);

    return attempts.map((attempt) => ({
      ...MockTestMapper.toAttempt(attempt),
      mockTest: MockTestMapper.toListItem(attempt.mock_test),
    }));
  }
}
