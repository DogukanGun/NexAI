import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Use CommonJS import for weaviate-client
const weaviate = require('weaviate-client').default;
// Import the type separately
import type { WeaviateClient } from 'weaviate-client';

@Injectable()
export class WeaviateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WeaviateService.name);
  private _client: WeaviateClient | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.get<string>('WEAVIATE_URL');
    const apiKey = this.configService.get<string>('WEAVIATE_API_KEY');
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY'); // Needed if using OpenAI module

    if (!url || !apiKey) {
      this.logger.error(
        'Weaviate URL or API Key not configured. Please set WEAVIATE_URL and WEAVIATE_API_KEY environment variables.',
      );
      throw new Error('Weaviate configuration missing');
    }

    try {
      // Assuming connection to Weaviate Cloud (WCD) based on common usage
      // Adjust connectToLocal or connectToCustom if needed
      this._client = await weaviate.connectToWeaviateCloud(url, {
        authCredentials: new weaviate.ApiKey(apiKey),
        headers: {
          // Include OpenAI API key header if using Weaviate's OpenAI module
          // Adjust header name if using a different inference API
          'X-OpenAI-Api-Key': openaiApiKey || '', 
        },
      });
      this.logger.log('Successfully connected to Weaviate');
    } catch (err) {
      this.logger.error('Failed to connect to Weaviate', err);
      throw err; // Re-throw error to prevent application startup if connection fails
    }
  }

  async onModuleDestroy() {
    if (this._client) {
      try {
        await this._client.close(); // Use client.close() as per v3 docs
        this.logger.log('Weaviate connection closed');
      } catch (err) {
        this.logger.error('Failed to close Weaviate connection gracefully', err);
      }
    }
  }

  get client(): WeaviateClient {
    if (!this._client) {
      throw new Error(
        'Weaviate client not initialized. Ensure the module is properly loaded.',
      );
    }
    return this._client;
  }

  // --- Search Method Placeholder ---
  async searchLaborLaw(query: string): Promise<any> {
    if (!this.client) {
      throw new Error('Weaviate client not ready.');
    }
    this.logger.log(`Searching labor law with query: ${query}`);

    const collectionName = 'GermanLaborLaw'; // Updated to match our new collection
    const lawCollection = this.client.collections.get(collectionName);

    try {
      // Use nearText search with the correct API syntax for Weaviate v3
      const result = await lawCollection.query.nearText([query], {
        limit: 5,
        certainty: 0.7, // Threshold value between 0 and 1
      });

      if (!result || !result.objects || result.objects.length === 0) {
        this.logger.log('No results found for query');
        return [];
      }

      this.logger.log(`Found ${result.objects.length} results`);
      return result.objects;
    } catch (error) {
      this.logger.error(`Error searching Weaviate collection '${collectionName}'`, error);
      throw error;
    }
  }
} 