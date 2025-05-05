import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Set up more permissive CORS for development
  const corsOptions = {
    origin: isDevelopment 
      ? true // Allow all origins in development
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://frontend:3001',
          'http://127.0.0.1:3001'
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  };
  
  logger.log(`Starting application with CORS: ${JSON.stringify(corsOptions)}`);
  
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: corsOptions,
      logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all log levels
    }
  );

  const config = new DocumentBuilder()
    .setTitle('NexHR API')
    .setDescription('NexHR API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Create a simple test endpoint to verify the server is running
  app.getHttpAdapter().getInstance().get('/test', (req, reply) => {
    logger.log('Test endpoint called');
    return reply.send({ message: 'Backend is working!' });
  });

  await app.listen(3000, '0.0.0.0');
  logger.log(`Application started on: ${await app.getUrl()}`);
}
bootstrap();
