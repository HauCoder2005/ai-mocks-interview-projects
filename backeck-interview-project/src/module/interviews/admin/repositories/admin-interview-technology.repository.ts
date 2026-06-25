import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { AdminInterviewTechnologyMapper } from '../mappers/admin-interview-technology.mapper';
import { AdminInterviewTechnologyModel } from '../models/admin-interview-technology.model';
import { AdminInterviewTechnologyListQueryResult } from '../results/interview/technology/admin-interview-technology-list-query-result';

@Injectable()
export class AdminInterviewTechnologyRepository extends AbstractPrismaCrudService<any> {
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
   * Lấy toàn bộ Technology trong hệ thống.
   * Repository trả items và total để Service tạo meta cho response list.
   */
  async findAllWithTotal(): Promise<AdminInterviewTechnologyListQueryResult> {
    const technologies = await this.selectMany({
      orderBy: {
        id: 'asc',
      },
    });

    return {
      items: technologies.map(AdminInterviewTechnologyMapper.toModel),
      total: technologies.length,
    };
  }

  /*
   * Lấy các Technology đang bật.
   * Admin dùng để lọc danh sách Technology active.
   */
  async findActiveWithTotal(): Promise<AdminInterviewTechnologyListQueryResult> {
    const technologies = await this.selectMany({
      where: {
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      items: technologies.map(AdminInterviewTechnologyMapper.toModel),
      total: technologies.length,
    };
  }

  /*
   * Lấy các Technology đang tắt.
   * Admin dùng để xem danh sách Technology đã bị vô hiệu hóa.
   */
  async findInactiveWithTotal(): Promise<AdminInterviewTechnologyListQueryResult> {
    const technologies = await this.selectMany({
      where: {
        is_active: false,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      items: technologies.map(AdminInterviewTechnologyMapper.toModel),
      total: technologies.length,
    };
  }

  /*
   * Lấy các Technology đang active.
   * Candidate sẽ chỉ được chọn những Technology còn hoạt động.
   */
  async findActive(): Promise<AdminInterviewTechnologyModel[]> {
    const technologies = await this.selectMany({
      where: {
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return technologies.map(AdminInterviewTechnologyMapper.toModel);
  }

  /*
   * Lấy các Technology đang inactive.
   * Admin dùng để xem các Technology đang bị tắt.
   */
  async findInactive(): Promise<AdminInterviewTechnologyModel[]> {
    const technologies = await this.selectMany({
      where: {
        is_active: false,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return technologies.map(AdminInterviewTechnologyMapper.toModel);
  }

  /*
   * Tìm một Technology theo id.
   * Dùng khi Admin muốn cập nhật, kích hoạt hoặc vô hiệu hóa Technology.
   */
  async findById(id: number): Promise<AdminInterviewTechnologyModel | null> {
    const technology = await this.selectOne({ id });

    return technology
      ? AdminInterviewTechnologyMapper.toModel(technology)
      : null;
  }

  /*
   * Tìm một Technology theo code.
   * Dùng để kiểm tra trùng mã trước khi tạo hoặc cập nhật Technology.
   */
  async findByCode(
    code: string,
  ): Promise<AdminInterviewTechnologyModel | null> {
    const technology = await this.selectOne({ code });

    return technology
      ? AdminInterviewTechnologyMapper.toModel(technology)
      : null;
  }

  /*
   * Tìm một Technology theo slug.
   * Dùng để kiểm tra trùng slug trước khi tạo hoặc cập nhật Technology.
   */
  async findBySlug(
    slug: string,
  ): Promise<AdminInterviewTechnologyModel | null> {
    const technology = await this.selectOne({ slug });

    return technology
      ? AdminInterviewTechnologyMapper.toModel(technology)
      : null;
  }
}
