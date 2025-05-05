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
  
  try {
    logger.log('Starting application bootstrap process');
    
    const isDevelopment = process.env.NODE_ENV !== 'production';
    logger.log(`Node environment: ${process.env.NODE_ENV}`);
    
    // Set up more permissive CORS for development
    const corsOptions = {
      origin: isDevelopment 
        ? true // Allow all origins in development
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://frontend:3001',
            'http://127.0.0.1:3001',
            'https://hr.nexarb.com',
            'http://hr.nexarb.com'
          ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    };
    
    logger.log(`Starting application with CORS: ${JSON.stringify(corsOptions)}`);
    
    // Create NestJS application with Fastify
    logger.log('Creating NestJS application with Fastify adapter');
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        cors: corsOptions,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all log levels
      }
    );

    // Add explicit CORS headers middleware for more robust handling
    app.use((req: any, res: any, next: any) => {
      // Allow specific origins or use wildcard
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://frontend:3001',
        'https://hr.nexarb.com',
        'http://hr.nexarb.com'
      ];
      
      const origin = req.headers.origin;
      if (origin && (isDevelopment || allowedOrigins.includes(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      // Allow credentials
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      // Allow specific headers
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      
      // Allow specific methods
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }
      
      next();
    });

    // Set up Swagger documentation
    logger.log('Setting up Swagger documentation');
    const config = new DocumentBuilder()
      .setTitle('NexHR API')
      .setDescription('NexHR API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Start the server
    const host = '0.0.0.0';
    const port = 3000;
    logger.log(`Starting server on ${host}:${port}`);
    await app.listen(port, host);
    logger.log(`Application started on: ${await app.getUrl()}`);
    
    return app;
  } catch (error) {
    logger.error(`Error during application bootstrap: ${error instanceof Error ? error.message : String(error)}`);
    logger.error(error instanceof Error && error.stack ? error.stack : 'No stack trace available');
    process.exit(1); // Exit with error code
  }
}

// Add global uncaught exception handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
bootstrap()
  .catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
  });
