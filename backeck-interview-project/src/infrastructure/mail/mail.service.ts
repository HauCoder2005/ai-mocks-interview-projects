import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { MailConfig } from 'src/config/env.interface';
import { renderOtpEmailTemplate } from './templates/otp-email.template';
import { join } from 'path';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly mailFrom: string;
  private readonly logo = join(process.cwd(), 'assets', 'mail', 'logo.png');
    
  constructor(private readonly configService: ConfigService) {
    const mailConfig = this.configService.getOrThrow<MailConfig>('config.mail');

    this.mailFrom = mailConfig.from;

    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.user && mailConfig.password ? {
              user: mailConfig.user,
              pass: mailConfig.password,
            } : undefined,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Mail transporter verified successfully');
    } catch (error) {
      this.logger.warn('Mail transporter verification failed');
    }
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.mailFrom,
      to: email,
      subject: 'Mã xác thực tài khoản AI Mock Interview',
      html: renderOtpEmailTemplate(otpCode, this.logo),
    });
  }
}