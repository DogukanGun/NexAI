import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const weaviate = require('weaviate-client').default;
import type { WeaviateClient } from 'weaviate-client';

@Injectable()
export class WeaviateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WeaviateService.name);
  private _client: WeaviateClient | null = null;
  private _isAvailable = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.get<string>('WEAVIATE_URL');
    const apiKey = this.configService.get<string>('WEAVIATE_API_KEY');
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY'); 

    if (!url || !apiKey) {
      this.logger.warn(
        'Weaviate URL or API Key not configured. The application will run, but Weaviate functionality will be unavailable.'
      );
      // Don't throw error, just log warning and continue
      return;
    }

    try {
      this._client = await weaviate.connectToWeaviateCloud(url, {
        authCredentials: new weaviate.ApiKey(apiKey),
        headers: {
          'X-OpenAI-Api-Key': openaiApiKey || '', 
        },
      });
      this._isAvailable = true;
      this.logger.log('Successfully connected to Weaviate');
    } catch (err) {
      this.logger.error('Failed to connect to Weaviate', err);
      this.logger.warn('The application will continue to run, but Weaviate functionality will be unavailable.');
      // Don't throw error, application can run without Weaviate
    }
  }

  async onModuleDestroy() {
    if (this._client) {
      try {
        await this._client.close();
        this.logger.log('Weaviate connection closed');
      } catch (err) {
        this.logger.error('Failed to close Weaviate connection gracefully', err);
      }
    }
  }

  get client(): WeaviateClient | null {
    return this._client;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  async searchLaborLaw(query: string): Promise<any> {
    if (!this.isAvailable || !this.client) {
      this.logger.warn('Weaviate is not available, returning empty search results');
      return [];
    }
    
    this.logger.log(`Searching labor law with query: ${query}`);

    const collectionName = 'GermanLaborLaw'; 
    
    try {
      const lawCollection = this.client.collections.get(collectionName);

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
      return []; // Return empty array instead of throwing
    }
  }
} 