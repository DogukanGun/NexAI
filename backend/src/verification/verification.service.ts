import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

// Token payload interface
interface VerificationTokenPayload {
  userId: string;
  email: string;
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private prismaService: PrismaService,
  ) {}

  /**
   * Generate a verification token and send verification email
   */
  async sendVerificationEmail(userId: string, email: string): Promise<boolean> {
    try {
      // Create a verification token using JWT
      const payload: VerificationTokenPayload = { userId, email };
      const token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_VERIFICATION_SECRET', 'verification-secret'),
        expiresIn: '24h', // Token expires in 24 hours
      });

      // Send the verification email
      const emailSent = await this.emailService.sendVerificationEmail(email, token);
      return emailSent;
    } catch (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Verify a user's email using the token
   */
  async verifyEmail(token: string): Promise<{ userId: string; email: string }> {
    try {
      // Verify the token
      const payload = await this.jwtService.verifyAsync<VerificationTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_VERIFICATION_SECRET', 'verification-secret'),
      });

      if (!payload.userId || !payload.email) {
        throw new UnauthorizedException('Invalid verification token');
      }

      // Update user's verification status in the database
      const user = await this.prismaService.user.update({
        where: { id: payload.userId },
        data: { isVerified: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User ${user.username} (${user.email}) has been verified`);
      return { userId: user.id, email: user.email };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid or expired verification token');
      }
      throw error;
    }
  }

  /**
   * Check if a user is verified
   */
  async isUserVerified(userId: string): Promise<boolean> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { isVerified: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user.isVerified;
    } catch (error) {
      this.logger.error(`Failed to check user verification status: ${error.message}`, error.stack);
      return false;
    }
  }
} 