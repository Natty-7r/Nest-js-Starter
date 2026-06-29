import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '@libs/logger';
import { AppModule } from './app.module';
import appConfig from './common/config/app.config';
import swaggerConfig from './common/config/swagger.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Get logger service
    const logger = app.get(LoggerService);

    logger.log(`App Name: ${appConfig.app.appName}`, { context: 'Bootstrap' });
    logger.log(`Port: ${appConfig.app.port}`, { context: 'Bootstrap' });
    logger.log(`Environment: ${appConfig.app.nodeEnv}`, { context: 'Bootstrap' });

    // Setup Swagger
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    logger.log(`Swagger documentation available at: http://localhost:${appConfig.app.port}/api`, { context: 'Bootstrap' });

    await app.listen(appConfig.app.port ?? 3000);
    logger.log(`Application is running on: http://localhost:${appConfig.app.port}`, { context: 'Bootstrap' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Use LoggerService for errors too
      console.error('❌ Failed to start application:');
      console.error(error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error('❌ Unknown error occurred');
    }
    process.exit(1);
  }
}

void bootstrap();
