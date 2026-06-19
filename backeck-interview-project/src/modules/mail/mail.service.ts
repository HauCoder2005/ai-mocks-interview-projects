import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SmtpErrorDetails {
  code?: unknown;
  command?: unknown;
  message?: unknown;
  response?: unknown;
  responseCode?: unknown;
  stack?: unknown;
}

/**
 * Service phụ trách gửi email giao dịch qua SMTP.
 *
 * Service này cô lập toàn bộ logic gửi mail khỏi AuthService để luồng xác thực
 * chỉ cần phát lệnh gửi OTP, không phụ thuộc vào chi tiết SMTP/Nodemailer.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.logSmtpConfiguration();
  }

  /**
   * Gửi OTP xác minh email qua SMTP.
   *
   * @param email Email người nhận OTP.
   * @param otp Mã OTP 6 chữ số đã được phát hành cho người dùng.
   * @returns Promise hoàn tất sau khi SMTP provider phản hồi.
   * @throws Error Khi SMTP provider từ chối hoặc không thể gửi email.
   */
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const from = this.configService.getOrThrow<string>('mail.from');
    const subject = 'Mã OTP xác minh tài khoản';
    const text = `Mã OTP của bạn là ${otp}. Mã này sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.`;
    const html = `
      <!doctype html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#334155;">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
            Mã OTP xác minh tài khoản của bạn là ${otp}.
          </div>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#ffffff;margin:0;padding:0;">
            <tr>
              <td align="center" style="padding:48px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:520px;margin:0 auto;">
                  <tr>
                    <td>
                      <p style="margin:0 0 32px 0;font-size:12px;line-height:18px;font-weight:700;letter-spacing:0.18em;color:#64748b;text-transform:uppercase;">
                        AI MOCK INTERVIEW
                      </p>

                      <h1 style="margin:0 0 16px 0;font-size:28px;line-height:36px;font-weight:700;color:#334155;">
                        Xác minh tài khoản của bạn
                      </h1>

                      <p style="margin:0 0 36px 0;font-size:16px;line-height:1.6;color:#334155;">
                        Sử dụng mã OTP bên dưới để hoàn tất quá trình đăng ký. Không chia sẻ mã này với bất kỳ ai.
                      </p>

                      <p style="margin:0 0 36px 0;font-size:44px;line-height:52px;font-weight:800;letter-spacing:12px;color:#2563eb;">
                        ${otp}
                      </p>

                      <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">
                        Mã OTP sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      await this.mailerService.sendMail({
        from,
        to: email,
        subject,
        text,
        html,
      });
    } catch (error) {
      this.logSmtpDeliveryError(email, error);
      throw new Error(`Không thể gửi OTP qua SMTP đến ${email}.`);
    }
  }

  private logSmtpConfiguration(): void {
    this.logger.debug(
      `SMTP config loaded: host=${this.configService.get<string>('mail.host')}, port=${String(
        this.configService.get<number>('mail.port'),
      )}, secure=${String(
        this.configService.get<boolean>('mail.secure'),
      )}, user=${this.maskSecret(
        this.configService.get<string>('mail.user'),
      )}, password=${this.maskSecret(
        this.configService.get<string>('mail.password'),
      )}, from=${this.configService.get<string>('mail.from')}`,
    );
  }

  private logSmtpDeliveryError(email: string, error: unknown): void {
    const details = this.resolveSmtpErrorDetails(error);

    this.logger.error(`Không thể gửi OTP qua SMTP đến ${email}.`);
    this.logger.error(`SMTP error object: ${this.stringifyError(error)}`);
    this.logger.error(
      `SMTP error message: ${this.formatUnknown(details.message, 'Không có message')}`,
    );
    this.logger.error(
      `SMTP error code=${this.formatUnknown(
        details.code,
        'N/A',
      )}, command=${this.formatUnknown(
        details.command,
        'N/A',
      )}, responseCode=${this.formatUnknown(
        details.responseCode,
        'N/A',
      )}, response=${this.formatUnknown(details.response, 'N/A')}`,
    );
    this.logger.error(
      `SMTP error stack: ${this.formatUnknown(
        details.stack,
        'Không có stack trace',
      )}`,
    );
  }

  private resolveSmtpErrorDetails(error: unknown): SmtpErrorDetails {
    if (error instanceof Error) {
      return {
        ...this.toRecord(error),
        message: error.message,
        stack: error.stack,
      };
    }

    return this.toRecord(error);
  }

  private toRecord(value: unknown): SmtpErrorDetails {
    if (typeof value === 'object' && value !== null) {
      return value;
    }

    return {
      message: String(value),
    };
  }

  private stringifyError(error: unknown): string {
    if (error instanceof Error) {
      return JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...this.toRecord(error),
      });
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  private formatUnknown(value: unknown, fallback: string): string {
    if (value === undefined || value === null) {
      return fallback;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    try {
      return JSON.stringify(value) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private maskSecret(value: string | undefined): string {
    if (!value) {
      return 'undefined';
    }

    if (value.length <= 4) {
      return '***';
    }

    return `${value.slice(0, 2)}***${value.slice(-2)}`;
  }
}
