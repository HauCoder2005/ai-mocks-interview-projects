import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createListMeta } from 'src/shared/responses/api-response.interface';
import { CreateInterviewTechnologyDto } from '../dtos/create-interview-technology.dto';
import { UpdateInterviewTechnologyDto } from '../dtos/update-interview-technology.dto';
import { AdminInterviewTechnologyMapper } from '../mappers/admin-interview-technology.mapper';
import { AdminInterviewTechnologyModel } from '../models/admin-interview-technology.model';
import { AdminInterviewTechnologyRepository } from '../repositories/admin-interview-technology.repository';
import { AdminInterviewTechnologyResponseDto } from '../responses/admin-interview-technology-response.dto';
import { AdminInterviewTechnologyListResponseResult } from '../results/interview/technology/admin-interview-technology-list-response-result';

@Injectable()
export class AdminInterviewTechnologyService {
  private readonly logger = new Logger(AdminInterviewTechnologyService.name);

  constructor(
    private readonly technologyRepository: AdminInterviewTechnologyRepository,
  ) {}

  /*
   * Tạo mới Interview Technology.
   * Trước khi tạo cần kiểm tra code và slug không bị trùng trong hệ thống.
   */
  async createTechnology(
    dto: CreateInterviewTechnologyDto,
  ): Promise<AdminInterviewTechnologyResponseDto> {
    this.logger.log(`Start creating interview technology: code=${dto.code}`);

    /*
     * Code và slug là 2 giá trị unique độc lập.
     * Có thể kiểm tra song song để giảm thời gian xử lý request.
     */
    await Promise.all([
      this.checkCodeUniqueness(dto.code),
      this.checkSlugUniqueness(dto.slug),
    ]);

    const technology = await this.technologyRepository.insertOne({
      name: dto.name,
      slug: dto.slug,
      code: dto.code,
      description: dto.description ?? null,
    });

    const technologyModel = AdminInterviewTechnologyMapper.toModel(technology);

    this.logger.log(
      `Interview technology created successfully: id=${technologyModel.id}, name=${technologyModel.name}, code=${technologyModel.code}`,
    );

    return AdminInterviewTechnologyMapper.toResponseDto(technologyModel);
  }

  /*
   * Lấy toàn bộ danh sách Interview Technology cho Admin.
   * Bao gồm cả Technology đang active và inactive.
   */
  async getTechnologies(): Promise<AdminInterviewTechnologyListResponseResult> {
    this.logger.log('Start retrieving interview technologies');

    const { items, total } = await this.technologyRepository.findAllWithTotal();

    return this.buildListResult(
      items,
      total,
      'Interview technologies retrieved',
    );
  }

  /*
   * Lấy danh sách Interview Technology đang active.
   * Danh sách này dùng cho Admin xem dữ liệu đang được bật trong hệ thống.
   */
  async getActiveTechnologies(): Promise<AdminInterviewTechnologyListResponseResult> {
    this.logger.log('Start retrieving active interview technologies');

    const { items, total } =
      await this.technologyRepository.findActiveWithTotal();

    return this.buildListResult(
      items,
      total,
      'Active interview technologies retrieved',
    );
  }

  /*
   * Lấy danh sách Interview Technology đang inactive.
   * Danh sách này dùng cho Admin xem các Technology đã bị vô hiệu hóa.
   */
  async getInactiveTechnologies(): Promise<AdminInterviewTechnologyListResponseResult> {
    this.logger.log('Start retrieving inactive interview technologies');

    const { items, total } =
      await this.technologyRepository.findInactiveWithTotal();

    return this.buildListResult(
      items,
      total,
      'Inactive interview technologies retrieved',
    );
  }

  /*
   * Cập nhật thông tin Interview Technology theo id.
   * Nếu request có thay đổi code hoặc slug thì cần kiểm tra trùng trước khi update.
   */
  async updateTechnology(
    id: number,
    dto: UpdateInterviewTechnologyDto,
  ): Promise<AdminInterviewTechnologyResponseDto> {
    this.logger.log(`Start updating interview technology: id=${id}`);

    await this.getTechnologyByIdOrThrow(id);

    /*
     * Chỉ kiểm tra unique cho field thật sự được gửi lên.
     * Nếu cả code và slug cùng được gửi thì chạy song song để tối ưu thời gian.
     */
    const uniquenessChecks: Promise<void>[] = [];

    if (dto.code) {
      uniquenessChecks.push(this.checkCodeUniqueness(dto.code, id));
    }

    if (dto.slug) {
      uniquenessChecks.push(this.checkSlugUniqueness(dto.slug, id));
    }

    await Promise.all(uniquenessChecks);

    const technology = await this.technologyRepository.updateOne(
      { id },
      {
        name: dto.name,
        slug: dto.slug,
        code: dto.code,
        description: dto.description,
        updated_at: new Date(),
      },
    );

    const technologyModel = AdminInterviewTechnologyMapper.toModel(technology);

    this.logger.log(
      `Interview technology updated successfully: id=${technologyModel.id}, name=${technologyModel.name}, code=${technologyModel.code}`,
    );

    return AdminInterviewTechnologyMapper.toResponseDto(technologyModel);
  }

  /*
   * Kích hoạt Interview Technology.
   * Sau khi active, Candidate có thể chọn Technology này khi cấu hình Interview.
   */
  async activateTechnology(
    id: number,
  ): Promise<AdminInterviewTechnologyResponseDto> {
    return this.updateStatus(id, true, 'activating', 'activated');
  }

  /*
   * Vô hiệu hóa Interview Technology.
   * Không xóa cứng để tránh ảnh hưởng Interview hoặc Configuration đã liên kết.
   */
  async deactivateTechnology(
    id: number,
  ): Promise<AdminInterviewTechnologyResponseDto> {
    return this.updateStatus(id, false, 'deactivating', 'deactivated');
  }

  /*
   * Xóa cứng Interview Technology khi chưa được sử dụng.
   */
  async deleteTechnology(
    id: number,
  ): Promise<AdminInterviewTechnologyResponseDto> {
    this.logger.log(`Start deleting interview technology: id=${id}`);

    this.validateId(id);
    await this.getTechnologyByIdOrThrow(id);

    const usageCount = await this.technologyRepository.countUsage(id);

    if (usageCount > 0) {
      this.logger.warn(
        `Delete technology failed because it is in use: id=${id}, usageCount=${usageCount}`,
      );

      throw new ConflictException('Không thể xóa vì dữ liệu đang được sử dụng.');
    }

    const technology = await this.technologyRepository.deleteTechnology(id);

    this.logger.log(
      `Interview technology deleted successfully: id=${technology.id}, code=${technology.code}`,
    );

    return AdminInterviewTechnologyMapper.toResponseDto(technology);
  }

  /*
   * Gộp logic build response list cho các API danh sách.
   * Helper này chịu trách nhiệm map domain model sang response DTO và tạo meta.
   */
  private buildListResult(
    items: AdminInterviewTechnologyModel[],
    total: number,
    logMessage: string,
  ): AdminInterviewTechnologyListResponseResult {
    const data = items.map(AdminInterviewTechnologyMapper.toResponseDto);

    this.logger.log(
      `${logMessage} successfully: total=${total}, itemCount=${data.length}`,
    );

    return {
      data,
      meta: createListMeta({
        total,
        itemCount: data.length,
      }),
    };
  }

  /*
   * Gộp logic cập nhật trạng thái active/inactive.
   * Dùng chung cho activateTechnology và deactivateTechnology để tránh lặp code.
   */
  private async updateStatus(
    id: number,
    isActive: boolean,
    startActionText: string,
    endActionText: string,
  ): Promise<AdminInterviewTechnologyResponseDto> {
    this.logger.log(`Start ${startActionText} interview technology: id=${id}`);

    await this.getTechnologyByIdOrThrow(id);

    const technology = await this.technologyRepository.updateOne(
      { id },
      {
        is_active: isActive,
        updated_at: new Date(),
      },
    );

    const technologyModel = AdminInterviewTechnologyMapper.toModel(technology);

    this.logger.log(
      `Interview technology ${endActionText} successfully: id=${technologyModel.id}, code=${technologyModel.code}`,
    );

    return AdminInterviewTechnologyMapper.toResponseDto(technologyModel);
  }

  /*
   * Lấy Interview Technology theo id.
   * Nếu không tìm thấy thì throw NotFoundException để dừng request.
   */
  private async getTechnologyByIdOrThrow(
    id: number,
  ): Promise<AdminInterviewTechnologyModel> {
    const technology = await this.technologyRepository.findById(id);

    if (!technology) {
      this.logger.warn(
        `Action failed - Interview technology not found: id=${id}`,
      );

      throw new NotFoundException('Interview technology not found');
    }

    return technology;
  }

  /*
   * Kiểm tra code của Interview Technology có bị trùng hay không.
   * Khi update, currentId dùng để bỏ qua chính bản ghi đang được cập nhật.
   */
  private async checkCodeUniqueness(
    code: string,
    currentId?: number,
  ): Promise<void> {
    const existedTechnology = await this.technologyRepository.findByCode(code);

    if (existedTechnology && existedTechnology.id !== currentId) {
      this.logger.warn(
        `Action failed - Interview technology code already exists: code=${code}`,
      );

      throw new ConflictException('Interview technology code already exists');
    }
  }

  /*
   * Kiểm tra slug của Interview Technology có bị trùng hay không.
   * Khi update, currentId dùng để bỏ qua chính bản ghi đang được cập nhật.
   */
  private async checkSlugUniqueness(
    slug: string,
    currentId?: number,
  ): Promise<void> {
    const existedTechnology = await this.technologyRepository.findBySlug(slug);

    if (existedTechnology && existedTechnology.id !== currentId) {
      this.logger.warn(
        `Action failed - Interview technology slug already exists: slug=${slug}`,
      );

      throw new ConflictException('Interview technology slug already exists');
    }
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid interview technology id');
    }
  }
}
