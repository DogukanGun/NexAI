import { Controller, Post, Body, HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { VerifiedUserGuard } from '../auth/guard/verified-user.guard';

// Define a DTO for the request
class QueryDto {
  @ApiProperty({
    description: 'The query about German labor law',
    example: 'What are the working hour regulations in Germany?',
  })
  @IsString()
  @IsNotEmpty({ message: 'Query cannot be empty' })
  query: string;
}

// Define a DTO for the response
class AgentResponseDto {
  @ApiProperty({
    description: 'The answer to the query',
    example: 'In Germany, the working hours are regulated by the Working Hours Act (Arbeitszeitgesetz). The standard maximum working time is 8 hours per day...',
  })
  answer: string;
}

@ApiTags('HR Agent')
@Controller('hr-agent')
@UseGuards(VerifiedUserGuard)
@ApiBearerAuth('JWT-auth')
export class HrAgentController {
  private readonly logger = new Logger(HrAgentController.name);

  constructor(private readonly agentService: AgentService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Ask a question about German labor law' })
  @ApiBody({ 
    type: QueryDto, 
    description: 'The query about German labor law',
    examples: {
      example1: {
        value: { query: 'What are the working hour regulations in Germany?' },
        summary: 'Ask about working hours',
      },
      example2: {
        value: { query: 'What are the rules for maternity leave in Germany?' },
        summary: 'Ask about maternity leave',
      },
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the answer to the query', 
    type: AgentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Query cannot be empty' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Account must be verified' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async askQuestion(@Body() queryDto: QueryDto): Promise<AgentResponseDto> {
    if (!queryDto.query || queryDto.query.trim() === '') {
      throw new HttpException('Query cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      this.logger.log(`Received HR query: ${queryDto.query}`);
      
      const answer = await this.agentService.executeAgent(queryDto.query);
      
      return { answer };
    } catch (error) {
      this.logger.error(`Error processing HR query: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to process your question. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 