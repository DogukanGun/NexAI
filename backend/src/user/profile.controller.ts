import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Define user profile response DTO for Swagger
class UserProfileDto {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

@Controller({ path: '/profile' })
@ApiTags('profile')
@ApiBearerAuth('JWT-auth')
export class ProfileController {

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the user profile', 
    type: UserProfileDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request): any {
    return req.user;
  }
}
