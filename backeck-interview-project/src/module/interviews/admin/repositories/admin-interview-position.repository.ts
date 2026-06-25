import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

import { AdminInterviewPositionMapper } from '../mappers/admin-interview-position.mapper';
import { AdminInterviewPositionModel } from '../models/admin-interview-position.model';

@Injectable()
export class AdminInterviewPositionRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.interview_positions);
  }

  /**
   * Lấy toàn bộ Position trong hệ thống.
   * Admin dùng danh sách này để quản lý master data vị trí phỏng vấn.
   */
  async findAll(): Promise<AdminInterviewPositionModel[]> {
    const positions = await this.selectMany({
      orderBy: {
        id: 'asc',
      },
    });

    return positions.map(AdminInterviewPositionMapper.toModel);
  }

  /**
   * Tìm một Position theo id.
   * Dùng khi admin muốn xem, cập nhật, kích hoạt hoặc vô hiệu hóa Position.
   */
  async findById(id: number): Promise<AdminInterviewPositionModel | null> {
    const position = await this.selectOne({ id });

    return position ? AdminInterviewPositionMapper.toModel(position) : null;
  }

  /**
   * Tìm một Position theo code.
   * Dùng để kiểm tra trùng mã trước khi tạo Position mới.
   */
  async findByCode(code: string): Promise<AdminInterviewPositionModel | null> {
    const position = await this.selectOne({ code });

    return position ? AdminInterviewPositionMapper.toModel(position) : null;
  }

  /**
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

  /**
   * Cập nhật thông tin Position.
   * Chỉ cập nhật các field thuộc master data, không đụng tới relation interviews.
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

  /**
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

  /**
   * Vô hiệu hóa Position.
   * Dữ liệu không bị xóa cứng để tránh ảnh hưởng các Interview đã liên kết trước đó.
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
}