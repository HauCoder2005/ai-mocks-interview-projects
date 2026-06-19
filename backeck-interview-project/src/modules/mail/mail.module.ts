import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

const getRequiredConfig = (
  configService: ConfigService,
  key: string,
): string => {
  const value = configService.get<string>(key);

  if (!value) {
    throw new Error(`Thiếu cấu hình SMTP bắt buộc: ${key}.`);
  }

  return value;
};

const getSmtpPort = (configService: ConfigService): number => {
  const rawPort = getRequiredConfig(configService, 'MAIL_PORT');
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Cấu hình SMTP MAIL_PORT không hợp lệ.');
  }

  return port;
};

/**
 * Module SMTP dùng chung cho toàn ứng dụng.
 *
 * Module đăng ký MailerModule bằng ConfigService và export MailService để các
 * feature module chỉ phụ thuộc vào abstraction gửi mail nội bộ.
 */
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /**
         * Đọc trực tiếp biến môi trường SMTP để fail-fast khi thiếu cấu hình.
         * Không dùng fallback host tĩnh để tránh gửi nhầm tới domain mẫu.
         */
        const host = getRequiredConfig(configService, 'MAIL_HOST');
        const port = getSmtpPort(configService);
        const user = getRequiredConfig(configService, 'MAIL_USER');
        const password = getRequiredConfig(configService, 'MAIL_PASSWORD');
        const from = getRequiredConfig(configService, 'MAIL_FROM');

        return {
          transport: {
            host,
            port,
            secure: port === 465,
            auth: {
              user,
              pass: password,
            },
          },
          defaults: {
            from,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
