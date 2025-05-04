import { Module } from '@nestjs/common';
import { WeaviateService } from './weaviate.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Import ConfigModule to access environment variables
  providers: [WeaviateService],
  exports: [WeaviateService], // Export the service so other modules can use it
})
export class WeaviateModule {} 