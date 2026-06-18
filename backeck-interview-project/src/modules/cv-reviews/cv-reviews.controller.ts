import {
  Controller,
  FileValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CvReviewsService } from './cv-reviews.service';

const SUPPORTED_CV_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

/**
 * Validator kiểm tra định dạng MIME của file CV.
 */
class CvFileMimeTypeValidator extends FileValidator<{
  mimeTypes: readonly string[];
}> {
  isValid(file?: Express.Multer.File): boolean {
    return Boolean(
      file && this.validationOptions.mimeTypes.includes(file.mimetype),
    );
  }

  buildErrorMessage(): string {
    return 'Chỉ chấp nhận file PDF, DOCX hoặc DOC.';
  }
}

/**
 * Controller upload CV để AI chấm điểm.
 */
@ApiTags('CV Reviews')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cv-reviews')
export class CvReviewsController {
  constructor(private readonly cvReviewsService: CvReviewsService) {}

  /**
   * Upload file CV và tạo yêu cầu chấm điểm AI.
   *
   * @param user Người dùng đã xác thực.
   * @param file File CV đã qua validation.
   * @returns Thông tin review vừa tạo.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload CV để AI chấm điểm',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadCv(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new CvFileMimeTypeValidator({
            mimeTypes: SUPPORTED_CV_MIME_TYPES,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cvReviewsService.uploadCvForReview(user.id, file);
  }
}
