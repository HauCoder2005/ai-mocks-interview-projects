import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CvFileType, CvReviewStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { MinioService } from '../storage/minio.service';

export interface UploadCvReviewResult {
  reviewId: number;
  fileUrl: string;
  status: string;
}

/**
 * Service xử lý nghiệp vụ upload CV và tạo bản ghi chấm điểm AI.
 */
@Injectable()
export class CvReviewsService {
  private readonly logger = new Logger(CvReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Upload CV lên MinIO và tạo record review ở trạng thái PENDING.
   *
   * @param candidateId Id người dùng đã xác thực.
   * @param file File CV đã qua validation ở controller.
   * @returns Id review, URL file và trạng thái hiện tại.
   * @throws BadRequestException Khi định dạng file không hợp lệ.
   * @throws InternalServerErrorException Khi lưu file hoặc database thất bại.
   */
  async uploadCvForReview(
    candidateId: number,
    file: Express.Multer.File,
  ): Promise<UploadCvReviewResult> {
    const fileType = this.resolveFileType(file.mimetype);

    try {
      const fileUrl = await this.minioService.uploadFile(file, 'cv-uploads');
      const review = await this.prisma.cvReview.create({
        data: {
          candidateId,
          originalFileName: file.originalname,
          fileUrl,
          fileType,
          status: CvReviewStatus.PENDING,
        },
        select: {
          id: true,
          fileUrl: true,
          status: true,
        },
      });

      void this.extractTextAndReview(String(review.id), review.fileUrl);

      return {
        reviewId: review.id,
        fileUrl: review.fileUrl,
        status: review.status,
      };
    } catch (error) {
      this.logger.error(
        `Không thể tạo CV review cho candidateId=${candidateId}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Không thể upload CV để chấm điểm. Vui lòng thử lại sau.',
      );
    }
  }

  private resolveFileType(mimetype: string): CvFileType {
    if (mimetype === 'application/pdf') {
      return CvFileType.PDF;
    }

    if (
      mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return CvFileType.DOCX;
    }

    if (mimetype === 'application/msword') {
      return CvFileType.DOC;
    }

    throw new BadRequestException('Định dạng CV không được hỗ trợ.');
  }

  private extractTextAndReview(cvId: string, fileUrl: string): void {
    /**
     * Đây là điểm mở rộng để parse text từ PDF/DOC/DOCX và gọi LLM chấm điểm.
     * Luồng hiện tại chỉ tạo khung xử lý bất đồng bộ để không chặn API upload.
     */
    this.logger.debug(
      `Đã xếp hàng xử lý CV review cvId=${cvId}, fileUrl=${fileUrl}.`,
    );
  }
}
