import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';
import { CandidateInterviewTechnologyMapper } from '../mappers/candidate-interview-technology.mapper';
import { CandidateInterviewTechnologyListResult } from '../results/interview-technology/candidate-interview-technology-list-result';

@Injectable()
export class CandidateInterviewTechnologyRepository extends AbstractPrismaCrudService<any> {
  constructor(prismaService: PrismaService) {
    super(prismaService.interview_technologies);
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
   * Dùng để lấy một bản ghi theo unique field như id, code hoặc slug.
   */
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Candidate hiện tại không dùng tạo Technology, nhưng vẫn phải implement vì kế thừa abstract CRUD.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Candidate hiện tại không dùng cập nhật Technology, nhưng vẫn phải implement vì kế thừa abstract CRUD.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   * Candidate hiện tại không dùng xóa Technology, nhưng vẫn phải implement vì kế thừa abstract CRUD.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  /*
   * Lấy danh sách Technology đang active cho Candidate chọn.
   * Theo business rule, mỗi Interview phải có ít nhất một Technology được lựa chọn.
   */
  async findActiveWithTotal(): Promise<CandidateInterviewTechnologyListResult> {
    const technologies = await this.selectMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    });

    return {
      items: technologies.map(CandidateInterviewTechnologyMapper.toModel),
      total: technologies.length,
    };
  }
}
