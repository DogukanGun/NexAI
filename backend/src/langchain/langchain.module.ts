import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { WeaviateSearchTool } from './weaviate.tool';
import { WeaviateModule } from '../weaviate/weaviate.module';
import { ConfigModule } from '@nestjs/config';
import { HrAgentController } from './hr-agent.controller';

@Module({
  imports: [
    WeaviateModule, // Import Weaviate module to use its services
    ConfigModule, // Import ConfigModule for environment variables
  ],
  controllers: [HrAgentController],
  providers: [AgentService, WeaviateSearchTool],
  exports: [AgentService], // Export the agent service for use in other modules
})
export class LangchainModule {} 