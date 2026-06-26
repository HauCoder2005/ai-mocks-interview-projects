import { Injectable } from '@nestjs/common';
import {
  interview_configurations_interview_type,
  interview_levels,
  interview_positions,
  interview_technologies,
  interview_topics,
} from 'generated/prisma/client';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import {
  CandidateInterviewConfigurationRecord,
  CandidateInterviewConfigurationResult,
} from '../results/interview-configurations/candidate-interview-configuration-result';

@Injectable()
export class CandidateInterviewConfigurationRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.interview_configurations);
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
   * Dùng để lấy một bản ghi theo unique field như id.
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
   * Tìm Position đang active theo id.
   * Dùng để đảm bảo Candidate chỉ cấu hình phỏng vấn bằng master data hợp lệ.
   */
  async findActivePositionById(
    id: number,
  ): Promise<interview_positions | null> {
    return this.prismaService.interview_positions.findFirst({
      where: {
        id,
        is_active: true,
      },
    });
  }

  /*
   * Tìm Level đang active theo id.
   * Dùng để đảm bảo Candidate chọn đúng level còn hoạt động.
   */
  async findActiveLevelById(id: number): Promise<interview_levels | null> {
    return this.prismaService.interview_levels.findFirst({
      where: {
        id,
        is_active: true,
      },
    });
  }

  /*
   * Lấy danh sách Technology active theo danh sách id.
   * Service dùng kết quả này để so khớp đủ số lượng id hợp lệ.
   */
  async findActiveTechnologiesByIds(
    ids: number[],
  ): Promise<interview_technologies[]> {
    return this.prismaService.interview_technologies.findMany({
      where: {
        id: {
          in: ids,
        },
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  /*
   * Lấy danh sách Topic active theo danh sách id.
   * Topic không có slug nên chỉ validate theo id và trạng thái active.
   */
  async findActiveTopicsByIds(ids: number[]): Promise<interview_topics[]> {
    return this.prismaService.interview_topics.findMany({
      where: {
        id: {
          in: ids,
        },
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  /*
   * Tạo Interview Configuration cùng Technology và Topic relations trong transaction.
   * Nếu tạo relation lỗi thì toàn bộ configuration sẽ được rollback.
   */
  async createConfiguration(params: {
    userId: number;
    positionId: number;
    levelId: number;
    name: string;
    interviewType: interview_configurations_interview_type;
    questionCount: number;
    durationMinutes: number;
    description?: string;
    technologyIds: number[];
    topicIds: number[];
  }): Promise<CandidateInterviewConfigurationResult> {
    const configuration = await this.prismaService.$transaction(async (tx) => {
      return tx.interview_configurations.create({
        data: {
          user_id: params.userId,
          position_id: params.positionId,
          level_id: params.levelId,
          name: params.name,
          interview_type: params.interviewType,
          question_count: params.questionCount,
          duration_minutes: params.durationMinutes,
          description: params.description ?? null,
          interview_configuration_technologies: {
            create: params.technologyIds.map((technologyId) => ({
              technology_id: technologyId,
            })),
          },
          interview_configuration_topics: {
            create: params.topicIds.map((topicId) => ({
              topic_id: topicId,
            })),
          },
        },
        include: {
          interview_positions: true,
          interview_levels: true,
          interview_configuration_technologies: {
            include: {
              interview_technologies: true,
            },
          },
          interview_configuration_topics: {
            include: {
              interview_topics: true,
            },
          },
        },
      });
    });

    return {
      configuration:
        configuration as unknown as CandidateInterviewConfigurationRecord,
    };
  }
}
