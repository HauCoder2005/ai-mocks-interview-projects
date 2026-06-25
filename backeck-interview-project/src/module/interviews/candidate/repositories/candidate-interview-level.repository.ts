import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';
import { CandidateInterviewLevelMapper } from '../mappers/candidate-interview-level.mapper';
import { CandidateInterviewLevelListResult } from '../results/interview-level/candidate-interview-level-list-result';

@Injectable()
export class CandidateInterviewLevelRepository extends AbstractPrismaCrudService<any> {
  constructor(prismaService: PrismaService) {
    super(prismaService.interview_levels);
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
   * Lấy danh sách Level đang active cho Candidate chọn.
   * Candidate chỉ được nhìn thấy các Level còn hoạt động.
   */
  async findActiveWithTotal(): Promise<CandidateInterviewLevelListResult> {
    const levels = await this.selectMany({
      where: {
        is_active: true,
      },
      orderBy: [
        {
          display_order: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return {
      items: levels.map(CandidateInterviewLevelMapper.toModel),
      total: levels.length,
    };
  }
}
