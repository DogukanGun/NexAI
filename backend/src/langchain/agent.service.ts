import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeaviateSearchTool } from './weaviate.tool';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AgentService implements OnModuleInit {
  private readonly logger = new Logger(AgentService.name);
  private executor: any; // Executor type is complex in Langchain, using 'any' for simplicity

  constructor(
    private readonly configService: ConfigService,
    private readonly weaviateSearchTool: WeaviateSearchTool,
  ) {}

  async onModuleInit() {
    await this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
      
      if (!openaiApiKey) {
        this.logger.error('OpenAI API key not found. Cannot initialize agent.');
        throw new Error('OpenAI API key missing');
      }

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

      this.logger.log('Agent initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize agent', error);
      throw error;
    }
  }

  /**
   * Execute the agent with a user query
   * @param query The user's question about German labor law
   * @returns The agent's response
   */
  async executeAgent(query: string): Promise<string> {
    if (!this.executor) {
      throw new Error('Agent not initialized');
    }

    try {
      const result = await this.executor.invoke({
        input: query,
      });

      return result.output || 'No answer found.';
    } catch (error) {
      this.logger.error(`Error executing agent: ${error.message}`);
      return `Sorry, I encountered an error while processing your question: ${error.message}`;
    }
  }
} 