import { Injectable, NotFoundException } from '@nestjs/common';
import { MockTestStatus } from 'generated/prisma/client';

import { MockTestMapper } from '../../mappers/mock-test.mapper';
import { MockTestRepository } from '../../repositories/mock-test.repository';
import { AttachMockTestQuestionsDto } from '../dtos/attach-mock-test-questions.dto';
import { CreateMockTestDto } from '../dtos/create-mock-test.dto';
import { MockTestQueryDto } from '../dtos/mock-test-query.dto';
import { UpdateMockTestDto } from '../dtos/update-mock-test.dto';

@Injectable()
export class AdminMockTestService {
  constructor(private readonly mockTestRepository: MockTestRepository) {}

  async getMockTests(query: MockTestQueryDto) {
    const result = await this.mockTestRepository.findAllForAdmin(query);

    return {
      data: result.items.map((item) => MockTestMapper.toListItem(item)),
      meta: result.meta,
    };
  }

  async createMockTest(adminUserId: number, dto: CreateMockTestDto) {
    const mockTest = await this.mockTestRepository.create(adminUserId, dto);

    return MockTestMapper.toDetail(mockTest, true);
  }

  async getMockTestById(id: number) {
    const mockTest = await this.mockTestRepository.findById(id);

    if (!mockTest) {
      throw new NotFoundException('Mock test not found');
    }

    return MockTestMapper.toDetail(mockTest, true);
  }

  async updateMockTest(id: number, dto: UpdateMockTestDto) {
    const mockTest = await this.mockTestRepository.update(id, dto);

    return MockTestMapper.toDetail(mockTest, true);
  }

  async deleteMockTest(id: number) {
    const mockTest = await this.mockTestRepository.delete(id);

    return MockTestMapper.toDetail(mockTest, true);
  }

  async publishMockTest(id: number) {
    const mockTest = await this.mockTestRepository.updateStatus(
      id,
      MockTestStatus.PUBLISHED,
    );

    return MockTestMapper.toDetail(mockTest, true);
  }

  async archiveMockTest(id: number) {
    const mockTest = await this.mockTestRepository.updateStatus(
      id,
      MockTestStatus.ARCHIVED,
    );

    return MockTestMapper.toDetail(mockTest, true);
  }

  async attachQuestions(id: number, dto: AttachMockTestQuestionsDto) {
    const mockTest = await this.mockTestRepository.replaceQuestions(
      id,
      dto.questionBankIds,
    );

    return MockTestMapper.toDetail(mockTest, true);
  }
}
