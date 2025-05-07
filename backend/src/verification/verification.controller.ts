import { Controller, Get, Post, Query, Param, BadRequestException, Res, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly configService: ConfigService
  ) {}

  @Get('verify')
  @ApiOperation({ summary: 'Verify a user email with token' })
  @ApiQuery({ name: 'token', type: String, description: 'Verification token sent via email' })
  @ApiResponse({ status: 200, description: 'Email verification successful' })
  @ApiResponse({ status: 400, description: 'Invalid verification request' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async verifyEmail(
    @Query('token') token: string,
    @Query('redirect') redirect?: string,
    @Res({ passthrough: true }) res?: FastifyReply,
  ) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    try {
      const result = await this.verificationService.verifyEmail(token);
      
      // If redirect parameter is provided, perform a redirect
      if (redirect === 'true' && res) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
        return res.status(HttpStatus.FOUND)
          .header('Location', `${frontendUrl}/verify?success=true&email=${encodeURIComponent(result.email)}`)
          .send();
      }
      
      // Otherwise return a JSON response
      return {
        success: true,
        message: 'Email verification successful',
        email: result.email,
        userId: result.userId
      };
    } catch (error) {
      // If redirect parameter is provided, perform a redirect
      if (redirect === 'true' && res) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
        return res.status(HttpStatus.FOUND)
          .header('Location', `${frontendUrl}/verify?success=false&error=${encodeURIComponent(error.message)}`)
          .send();
      }
      
      // Otherwise, throw the exception which will be caught by NestJS exception filters
      throw error;
    }
  }

  @Post('resend')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email resent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async resendVerificationEmail(
    @Body() body: { userId: string; email: string },
  ) {
    if (!body.userId || !body.email) {
      throw new BadRequestException('User ID and email are required');
    }

    const sent = await this.verificationService.sendVerificationEmail(body.userId, body.email);
    
    return {
      success: sent,
      message: sent 
        ? 'Verification email sent successfully' 
        : 'Failed to send verification email, please try again later',
    };
  }

  @Get('status/:userId')
  @ApiOperation({ summary: 'Check user verification status' })
  @ApiResponse({ status: 200, description: 'Returns the verification status of the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkVerificationStatus(@Param('userId') userId: string) {
    const isVerified = await this.verificationService.isUserVerified(userId);
    
    return {
      userId,
      isVerified,
    };
  }
} 