import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { AdminInterviewPositionMapper } from '../mappers/admin-interview-position.mapper';
import { AdminInterviewPositionModel } from '../models/admin-interview-position.model';
import { AdminInterviewPositionListQueryResult } from '../results/interview/position/admin-interview-position-list-query-result';

@Injectable()
export class AdminInterviewPositionRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.interview_positions);
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
   * Lấy toàn bộ Position trong hệ thống.
   * Repository trả items và total để Service tạo meta cho response list.
   */
  async findAllWithTotal(): Promise<AdminInterviewPositionListQueryResult> {
    const positions = await this.selectMany({
      orderBy: {
        id: 'asc',
      },
    });

    return {
      items: positions.map(AdminInterviewPositionMapper.toModel),
      total: positions.length,
    };
  }

  /*
   * Lấy các Position đang active.
   * Candidate sẽ chỉ được chọn những Position còn hoạt động.
   */
  async findActive(): Promise<AdminInterviewPositionModel[]> {
    const positions = await this.selectMany({
      where: {
        is_active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return positions.map(AdminInterviewPositionMapper.toModel);
  }

  /*
   * Tìm một Position theo id.
   * Dùng khi admin muốn cập nhật, kích hoạt hoặc vô hiệu hóa Position.
   */
  async findById(id: number): Promise<AdminInterviewPositionModel | null> {
    const position = await this.selectOne({ id });

    return position ? AdminInterviewPositionMapper.toModel(position) : null;
  }

  /*
   * Tìm một Position theo code.
   * Dùng để kiểm tra trùng mã trước khi tạo hoặc cập nhật Position.
   */
  async findByCode(code: string): Promise<AdminInterviewPositionModel | null> {
    const position = await this.selectOne({ code });

    return position ? AdminInterviewPositionMapper.toModel(position) : null;
  }

  /*
   * Tạo Position mới trong bảng interview_positions.
   * Position là master data để Candidate chọn khi cấu hình buổi phỏng vấn.
   */
  async createPosition(params: {
    name: string;
    code: string;
    description?: string;
  }): Promise<AdminInterviewPositionModel> {
    const position = await this.insertOne({
      name: params.name,
      code: params.code,
      description: params.description ?? null,
    });

    return AdminInterviewPositionMapper.toModel(position);
  }

  /*
   * Cập nhật thông tin Position.
   * Chỉ cập nhật dữ liệu master data, không đụng tới relation interviews.
   */
  async updatePosition(
    id: number,
    params: {
      name?: string;
      code?: string;
      description?: string;
    },
  ): Promise<AdminInterviewPositionModel> {
    const position = await this.updateOne(
      { id },
      {
        name: params.name,
        code: params.code,
        description: params.description,
        updated_at: new Date(),
      },
    );

    return AdminInterviewPositionMapper.toModel(position);
  }

  /*
   * Kích hoạt Position để Candidate có thể chọn khi tạo Interview Configuration.
   */
  async activate(id: number): Promise<AdminInterviewPositionModel> {
    const position = await this.updateOne(
      { id },
      {
        is_active: true,
        updated_at: new Date(),
      },
    );

    return AdminInterviewPositionMapper.toModel(position);
  }

  /*
   * Vô hiệu hóa Position.
   * Không xóa cứng để tránh ảnh hưởng các Interview hoặc Configuration đã liên kết.
   */
  async deactivate(id: number): Promise<AdminInterviewPositionModel> {
    const position = await this.updateOne(
      { id },
      {
        is_active: false,
        updated_at: new Date(),
      },
    );

    return AdminInterviewPositionMapper.toModel(position);
  }

  /*
   * Đếm các dữ liệu nghiệp vụ đang tham chiếu Position.
   * Nếu count > 0 thì Service không được hard delete để tránh lỗi FK.
   */
  async countUsage(id: number): Promise<number> {
    const [configurationCount, interviewCount] = await Promise.all([
      this.prismaService.interview_configurations.count({
        where: {
          position_id: id,
        },
      }),
      this.prismaService.interviews.count({
        where: {
          position_id: id,
        },
      }),
    ]);

    return configurationCount + interviewCount;
  }

  /*
   * Xóa cứng Position khi không còn dữ liệu liên quan.
   */
  async deletePosition(id: number): Promise<AdminInterviewPositionModel> {
    const position = await this.deleteOne({ id });

    return AdminInterviewPositionMapper.toModel(position);
  }
}
