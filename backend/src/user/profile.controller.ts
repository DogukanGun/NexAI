import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: '/profile' })
@ApiTags('profile')
export class ProfileController {

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Req() req: Request): any {
    return req.user;
  }
}
