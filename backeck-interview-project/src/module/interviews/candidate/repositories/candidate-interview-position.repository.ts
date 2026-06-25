import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { CandidateInterviewPositionMapper } from '../mappers/candidate-interview-position.mapper';
import { CandidateInterviewPositionListResult } from '../results/candidate-interview-position-list-result';

@Injectable()
export class CandidateInterviewPositionRepository extends AbstractPrismaCrudService<any> {
  constructor(prismaService: PrismaService) {
    super(prismaService.interview_positions);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  selectMany(query?: any): Promise<any[]> {
    return this.executeSelectMany(query);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  /*
   * Lấy danh sách Position đang active.
   * Repository trả items và total để service tạo meta cho response list.
   */
  async findActiveWithTotal(): Promise<CandidateInterviewPositionListResult> {
    const positions = await this.selectMany({
      where: {
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      items: positions.map(CandidateInterviewPositionMapper.toModel),
      total: positions.length,
    };
  }
}