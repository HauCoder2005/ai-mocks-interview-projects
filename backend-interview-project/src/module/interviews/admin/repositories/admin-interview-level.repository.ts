import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';
import { AdminInterviewLevelMapper } from '../mappers/admin-interview-level.mapper';
import { AdminInterviewLevelModel } from '../models/admin-interview-level.model';
import { AdminInterviewLevelListQueryResult } from '../results/interview/level/admin-interview-level-list-query-result';

@Injectable()
export class AdminInterviewLevelRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
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
   * Lấy toàn bộ Level trong hệ thống.
   * Repository trả items và total để Service tạo meta cho response list.
   */
  async findAllWithTotal(): Promise<AdminInterviewLevelListQueryResult> {
    const levels = await this.selectMany({
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
      items: levels.map(AdminInterviewLevelMapper.toModel),
      total: levels.length,
    };
  }

  /*
   * Lấy các Level đang bật.
   * Dùng cho Admin khi cần lọc Level active và dùng cho
   * Candidate khi chọn Level.
   */
  async findActiveWithTotal(): Promise<AdminInterviewLevelListQueryResult> {
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
      items: levels.map(AdminInterviewLevelMapper.toModel),
      total: levels.length,
    };
  }

  /*
   * Lấy các Level đang tắt.
   * Dùng cho Admin khi cần xem danh sách Level đã bị vô hiệu hóa.
   */
  async findInactiveWithTotal(): Promise<AdminInterviewLevelListQueryResult> {
    const levels = await this.selectMany({
      where: {
        is_active: false,
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
      items: levels.map(AdminInterviewLevelMapper.toModel),
      total: levels.length,
    };
  }

  /*
   * Lấy các Level đang active.
   * Candidate sẽ chỉ được chọn những Level còn hoạt động.
   */
  async findActive(): Promise<AdminInterviewLevelModel[]> {
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

    return levels.map(AdminInterviewLevelMapper.toModel);
  }

  /*
   * Lấy các Level đang inactive.
   * Admin dùng để xem các Level đang bị tắt.
   */
  async findInactive(): Promise<AdminInterviewLevelModel[]> {
    const levels = await this.selectMany({
      where: {
        is_active: false,
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

    return levels.map(AdminInterviewLevelMapper.toModel);
  }

  /*
   * Tìm một Level theo id.
   * Dùng khi admin muốn cập nhật, kích hoạt hoặc vô hiệu hóa Level.
   */
  async findById(id: number): Promise<AdminInterviewLevelModel | null> {
    const level = await this.selectOne({ id });

    return level ? AdminInterviewLevelMapper.toModel(level) : null;
  }

  /*
   * Tìm một Level theo code.
   * Dùng để kiểm tra trùng mã trước khi tạo hoặc cập nhật Level.
   */
  async findByCode(code: string): Promise<AdminInterviewLevelModel | null> {
    const level = await this.selectOne({ code });

    return level ? AdminInterviewLevelMapper.toModel(level) : null;
  }

  /*
   * Tạo Level mới trong bảng interview_levels.
   * Level là master data để Candidate chọn kinh
   * nghiệm khi cấu hình buổi phỏng vấn.
   */
  async createLevel(params: {
    name: string;
    code: string;
    description?: string;
    displayOrder: number;
  }): Promise<AdminInterviewLevelModel> {
    const level = await this.insertOne({
      name: params.name,
      code: params.code,
      description: params.description ?? null,
      display_order: params.displayOrder,
    });

    return AdminInterviewLevelMapper.toModel(level);
  }

  /*
   * Cập nhật thông tin Level.
   * Chỉ cập nhật dữ liệu master data, không đụng tới relation interviews.
   */
  async updateLevel(
    id: number,
    params: {
      name?: string;
      code?: string;
      description?: string;
      displayOrder?: number;
    },
  ): Promise<AdminInterviewLevelModel> {
    const level = await this.updateOne(
      { id },
      {
        name: params.name,
        code: params.code,
        description: params.description,
        display_order: params.displayOrder,
        updated_at: new Date(),
      },
    );

    return AdminInterviewLevelMapper.toModel(level);
  }

  /*
   * Kích hoạt Level để Candidate có thể chọn khi tạo Interview Configuration.
   */
  async activate(id: number): Promise<AdminInterviewLevelModel> {
    const level = await this.updateOne(
      { id },
      {
        is_active: true,
        updated_at: new Date(),
      },
    );

    return AdminInterviewLevelMapper.toModel(level);
  }

  /*
   * Vô hiệu hóa Level.
   * Không xóa cứng để tránh ảnh hưởng các
   * Interview hoặc Configuration đã liên kết.
   */
  async deactivate(id: number): Promise<AdminInterviewLevelModel> {
    const level = await this.updateOne(
      { id },
      {
        is_active: false,
        updated_at: new Date(),
      },
    );

    return AdminInterviewLevelMapper.toModel(level);
  }

  /*
   * Đếm các dữ liệu nghiệp vụ đang tham chiếu Level.
   */
  async countUsage(id: number): Promise<number> {
    const [configurationCount, interviewCount] = await Promise.all([
      this.prismaService.interview_configurations.count({
        where: {
          level_id: id,
        },
      }),
      this.prismaService.interviews.count({
        where: {
          experience_level_id: id,
        },
      }),
    ]);

    return configurationCount + interviewCount;
  }

  /*
   * Xóa cứng Level khi không còn dữ liệu liên quan.
   */
  async deleteLevel(id: number): Promise<AdminInterviewLevelModel> {
    const level = await this.deleteOne({ id });

    return AdminInterviewLevelMapper.toModel(level);
  }
}
