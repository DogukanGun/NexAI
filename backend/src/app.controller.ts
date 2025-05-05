import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Welcome message endpoint' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message', schema: { type: 'string' } })
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('test')
  @ApiOperation({ summary: 'Health check endpoint for Docker' })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  healthCheck() {
    return { status: 'ok', message: 'Backend is up and running!' };
  }
}
