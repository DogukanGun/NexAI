import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeaviateSearchTool } from './weaviate.tool';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { WeaviateService } from '../weaviate/weaviate.service';

@Injectable()
export class AgentService implements OnModuleInit {
  private readonly logger = new Logger(AgentService.name);
  private executor: any; // Executor type is complex in Langchain, using 'any' for simplicity
  private isAgentAvailable = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly weaviateSearchTool: WeaviateSearchTool,
    private readonly weaviateService: WeaviateService,
  ) {}

  async onModuleInit() {
    await this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      // Check if Weaviate is available
      if (!this.weaviateService.isAvailable) {
        this.logger.warn('Weaviate service is not available. Agent will not be initialized.');
        return;
      }

      let openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
      
      if (!openaiApiKey) {
        this.logger.warn('OpenAI API key not found. Agent will not be initialized.');
        return;
      }

      // Fix the API key by removing any newlines or whitespace
      openaiApiKey = openaiApiKey.replace(/\s+/g, '');
      
      // Log key length and part of the key for debugging (don't log the full key)
      this.logger.log(`OpenAI API key length: ${openaiApiKey.length}`);
      this.logger.log(`OpenAI API key starts with: ${openaiApiKey.substring(0, 10)}...`);

      // Create the language model
      const model = new ChatOpenAI({
        modelName: 'gpt-4o', // or gpt-3.5-turbo if cost is a concern
        temperature: 0,
        openAIApiKey: openaiApiKey,
      });

      // Create tools array - add more tools as needed
      const tools = [this.weaviateSearchTool.createTool()];

      // Initialize the agent
      this.executor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        {
          agentType: 'openai-functions',
          verbose: true, // Set to false in production
        }
      );

      this.isAgentAvailable = true;
      this.logger.log('Agent initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize agent', error);
      this.logger.warn('The application will continue to run, but agent functionality will be unavailable.');
      // Don't throw error, application can run without the agent
    }
  }

  /**
   * Execute the agent with a user query
   * @param query The user's question about German labor law
   * @returns The agent's response
   */
  async executeAgent(query: string): Promise<string> {
    if (!this.isAgentAvailable || !this.executor) {
      return 'Sorry, the AI agent is not available at the moment. Please check if the required services (Weaviate, OpenAI) are properly configured.';
    }

    try {
      const result = await this.executor.invoke({
        input: query,
      });

      return result.output || 'No answer found.';
    } catch (error) {
      this.logger.error(`Error executing agent: ${error instanceof Error ? error.message : String(error)}`);
      return `Sorry, I encountered an error while processing your question. Please try again with a different question.`;
    }
  }
} 