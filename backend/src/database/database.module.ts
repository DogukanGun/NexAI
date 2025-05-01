import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import postgresConfig from 'src/config/postgres.config';
import { databaseModelsProviders } from './database-model.providers';
import { DatabaseService } from './database.service';

@Module({
    imports:[ConfigModule.forFeature(postgresConfig)],
    providers: [...databaseModelsProviders, DatabaseService],
    exports: [...databaseModelsProviders, DatabaseService],
})
export class DatabaseModule {}
