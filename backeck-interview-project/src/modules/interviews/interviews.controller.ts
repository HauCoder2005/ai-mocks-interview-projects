import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../../shared/guards';
import type { UploadedAudioFile } from '../storage/storage.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitInterviewAnswerDto } from './dto/submit-answer.dto';
import { InterviewsService } from './interviews.service';

/**
 * Controller HTTP cho mock interview.
 *
 * Controller chỉ nhận request, áp guard xác thực và chuyển dữ liệu xuống service
 * nghiệp vụ. Không đặt logic tạo câu hỏi, upload audio hay đánh giá AI tại đây.
 */
@ApiTags('Mock Interviews')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  /**
   * Tạo phiên phỏng vấn mới.
   *
   * @param user Người dùng đã xác thực.
   * @param dto Cấu hình phiên phỏng vấn.
   * @returns Id phiên vừa tạo.
   */
  @Post('start')
  @ApiOperation({
    summary: 'Tạo phiên mock interview',
  })
  startInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartInterviewDto,
  ) {
    return this.interviewsService.startInterview(user.id, dto);
  }

  /**
   * Sinh câu hỏi cho phiên phỏng vấn.
   *
   * @param user Người dùng đã xác thực.
   * @param sessionId Id phiên phỏng vấn.
   * @returns Danh sách id câu hỏi đã tạo.
   */
  @Post(':id/generate-questions')
  @ApiOperation({
    summary: 'Sinh câu hỏi cho phiên phỏng vấn',
  })
  generateQuestions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) sessionId: number,
  ) {
    return this.interviewsService.generateQuestions(user.id, sessionId);
  }

  /**
   * Gửi câu trả lời dạng text hoặc audio cho một câu hỏi.
   *
   * @param user Người dùng đã xác thực.
   * @param questionId Id câu hỏi.
   * @param dto Nội dung text trong multipart body.
   * @param audioFile File audio nếu client gửi kèm.
   * @returns Kết quả lưu answer và đánh giá AI stub.
   */
  @Post('questions/:id/answer')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Gửi câu trả lời cho câu hỏi phỏng vấn',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        textContent: {
          type: 'string',
        },
        audio: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  submitAnswer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) questionId: number,
    @Body() dto: SubmitInterviewAnswerDto,
    @UploadedFile() audioFile?: UploadedAudioFile,
  ) {
    return this.interviewsService.submitAnswer(
      user.id,
      questionId,
      dto,
      audioFile,
    );
  }
}
