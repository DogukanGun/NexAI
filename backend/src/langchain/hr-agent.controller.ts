import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AgentService } from './agent.service';

// Define a DTO for the request
class QueryDto {
  query: string;
}

// Define a DTO for the response
class AgentResponseDto {
  answer: string;
}

@Controller('hr-agent')
export class HrAgentController {
  private readonly logger = new Logger(HrAgentController.name);

  constructor(private readonly agentService: AgentService) {}

  @Post('ask')
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