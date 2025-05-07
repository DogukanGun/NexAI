import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super();
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to the database');
        } catch (error) {
            this.logger.warn(`Failed to connect to database: ${error.message}`);
            this.logger.warn('Running in limited mode without database connection');
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
} 