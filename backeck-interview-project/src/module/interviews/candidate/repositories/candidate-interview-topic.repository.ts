import { Injectable } from '@nestjs/common';
import { interview_topics } from 'generated/prisma/client';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { CandidateInterviewTopicMapper } from '../mappers/candidate-interview-topic.mapper';
import { CandidateInterviewTopicListResult } from '../results/interview-topic/candidate-interview-topic-list-result';

@Injectable()
export class CandidateInterviewTopicRepository extends AbstractPrismaCrudService<any> {
  constructor(prismaService: PrismaService) {
    super(prismaService.interview_topics);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để lấy nhiều bản ghi từ Prisma model.
   */
  selectMany(query?: any): Promise<any[]> {
    return this.executeSelectMany(query);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để lấy một bản ghi theo unique field như id hoặc code.
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Candidate hiện tại không dùng tạo Topic, nhưng vẫn phải implement vì kế thừa abstract CRUD.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Candidate hiện tại không dùng cập nhật Topic, nhưng vẫn phải implement vì kế thừa abstract CRUD.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Candidate hiện tại không dùng xóa Topic, nhưng vẫn phải implement vì kế thừa abstract CRUD.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  /*
   * Lấy danh sách Topic đang active cho Candidate chọn.
   * Theo business rule, focus topics chỉ lấy dữ liệu còn hoạt động.
   */
  async findActiveWithTotal(): Promise<CandidateInterviewTopicListResult> {
    const topics = (await this.selectMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    })) as interview_topics[];

    return {
      items: topics.map((topic) =>
        CandidateInterviewTopicMapper.toModel(topic),
      ),
      total: topics.length,
    };
  }
}
