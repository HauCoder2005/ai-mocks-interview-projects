import { Injectable } from '@nestjs/common';

import { MockTestMapper } from '../../mappers/mock-test.mapper';
import { MockTestRepository } from '../../repositories/mock-test.repository';
import { MockTestQueryDto } from '../../admin/dtos/mock-test-query.dto';
import { SubmitMockTestAnswerDto } from '../dtos/submit-mock-test-answer.dto';
import { SubmitMockTestDto } from '../dtos/submit-mock-test.dto';

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

  async getPublishedMockTest(identifier: string) {
    const id = Number(identifier);
    const mockTest =
      Number.isInteger(id) && id > 0
        ? await this.mockTestRepository.findPublishedById(id)
        : await this.mockTestRepository.findPublishedBySlug(identifier);

    if (!mockTest) {
      return null;
    }

    return MockTestMapper.toDetail(mockTest);
  }

  async submitMockTest(
    userId: number,
    mockTestId: number,
    dto: SubmitMockTestDto,
  ) {
    const result = await this.mockTestRepository.gradeMockTest(
      userId,
      mockTestId,
      dto.answers,
    );

    return MockTestMapper.toGradedResult(result);
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
