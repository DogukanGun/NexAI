import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EMAIL_VERIFICATION_TEMPLATE } from './email.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create reusable transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('EMAIL_USER', ''),
        pass: this.configService.get<string>('EMAIL_PASSWORD', ''),
      },
    });
  }

  private getEmailTemplate(): string {
    // Simply return the constant template
    return EMAIL_VERIFICATION_TEMPLATE;
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
    const verificationLink = `${baseUrl}/verify?token=${token}`;

    try {
      // Get email template and replace placeholders
      let template = this.getEmailTemplate();
      const username = email.split('@')[0]; // Use part before @ as username
      
      template = template
        .replace(/{{user_name}}/g, username)
        .replace(/{{verification_link}}/g, verificationLink)
        .replace(/{{current_year}}/g, new Date().getFullYear().toString());

      const info = await this.transporter.sendMail({
        from: `"NexAI" <${this.configService.get<string>('EMAIL_FROM', 'noreply@nexai.com')}>`,
        to: email,
        subject: 'Verify Your NexAI Account',
        html: template,
      });

      this.logger.log(`Verification email sent to ${email}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      return false;
    }
  }
} 