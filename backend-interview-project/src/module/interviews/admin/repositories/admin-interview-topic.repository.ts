import { Injectable } from '@nestjs/common';
import { interview_topics } from 'generated/prisma/client';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { AdminInterviewTopicMapper } from '../mappers/admin-interview-topic.mapper';
import { AdminInterviewTopicModel } from '../models/admin-interview-topic.model';
import { AdminInterviewTopicListQueryResult } from '../results/interview/topic/admin-interview-topic-list-query-result';

@Injectable()
export class AdminInterviewTopicRepository extends AbstractPrismaCrudService<any> {
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
   * Dùng để tạo mới một bản ghi.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để cập nhật một bản ghi theo unique field.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Dùng để xóa một bản ghi theo unique field.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  /*
   * Lấy toàn bộ Topic trong hệ thống.
   * Repository trả items và total để Service tạo meta cho response list.
   */
  async findAllWithTotal(): Promise<AdminInterviewTopicListQueryResult> {
    const topics = (await this.selectMany({
      orderBy: {
        id: 'asc',
      },
    })) as interview_topics[];

    return {
      items: topics.map((topic) => AdminInterviewTopicMapper.toModel(topic)),
      total: topics.length,
    };
  }

  /*
   * Lấy các Topic đang bật.
   * Admin dùng để lọc danh sách Topic active.
   */
  async findActiveWithTotal(): Promise<AdminInterviewTopicListQueryResult> {
    const topics = (await this.selectMany({
      where: {
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    })) as interview_topics[];

    return {
      items: topics.map((topic) => AdminInterviewTopicMapper.toModel(topic)),
      total: topics.length,
    };
  }

  /*
   * Lấy các Topic đang tắt.
   * Admin dùng để xem danh sách Topic đã bị vô hiệu hóa.
   */
  async findInactiveWithTotal(): Promise<AdminInterviewTopicListQueryResult> {
    const topics = (await this.selectMany({
      where: {
        is_active: false,
      },
      orderBy: {
        id: 'asc',
      },
    })) as interview_topics[];

    return {
      items: topics.map((topic) => AdminInterviewTopicMapper.toModel(topic)),
      total: topics.length,
    };
  }

  /*
   * Tìm một Topic theo id.
   * Dùng khi Admin muốn cập nhật, kích hoạt hoặc vô hiệu hóa Topic.
   */
  async findById(id: number): Promise<AdminInterviewTopicModel | null> {
    const topic = (await this.selectOne({ id })) as interview_topics | null;

    return topic ? AdminInterviewTopicMapper.toModel(topic) : null;
  }

  /*
   * Tìm một Topic theo code.
   * Dùng để kiểm tra trùng mã trước khi tạo hoặc cập nhật Topic.
   */
  async findByCode(code: string): Promise<AdminInterviewTopicModel | null> {
    const topic = (await this.selectOne({ code })) as interview_topics | null;

    return topic ? AdminInterviewTopicMapper.toModel(topic) : null;
  }

  /*
   * Tạo Topic mới trong bảng interview_topics.
   * Topic là master data để Candidate chọn focus topics.
   */
  async createTopic(params: {
    name: string;
    code: string;
    description?: string;
  }): Promise<AdminInterviewTopicModel> {
    const topic = (await this.insertOne({
      name: params.name,
      code: params.code,
      description: params.description ?? null,
    })) as interview_topics;

    return AdminInterviewTopicMapper.toModel(topic);
  }

  /*
   * Cập nhật thông tin Topic.
   * Chỉ cập nhật dữ liệu master data, không đụng tới relation interviews.
   */
  async updateTopic(
    id: number,
    params: {
      name?: string;
      code?: string;
      description?: string;
    },
  ): Promise<AdminInterviewTopicModel> {
    const topic = (await this.updateOne(
      { id },
      {
        name: params.name,
        code: params.code,
        description: params.description,
        updated_at: new Date(),
      },
    )) as interview_topics;

    return AdminInterviewTopicMapper.toModel(topic);
  }

  /*
   * Kích hoạt Topic để Candidate có thể chọn khi cấu hình focus topics.
   */
  async activate(id: number): Promise<AdminInterviewTopicModel> {
    const topic = (await this.updateOne(
      { id },
      {
        is_active: true,
        updated_at: new Date(),
      },
    )) as interview_topics;

    return AdminInterviewTopicMapper.toModel(topic);
  }

  /*
   * Vô hiệu hóa Topic.
   * Không xóa cứng để tránh ảnh hưởng Interview hoặc Configuration đã liên kết.
   */
  async deactivate(id: number): Promise<AdminInterviewTopicModel> {
    const topic = (await this.updateOne(
      { id },
      {
        is_active: false,
        updated_at: new Date(),
      },
    )) as interview_topics;

    return AdminInterviewTopicMapper.toModel(topic);
  }
}
