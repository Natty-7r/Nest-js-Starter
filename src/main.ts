import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import appConfig from './common/config/app.config';
import swaggerConfig from './common/config/swagger.config';

async function bootstrap() {
  try {
    console.log('✅ Config loaded successfully!');
    console.log(`   App Name: ${appConfig.app.appName}`);
    console.log(`   Port: ${appConfig.app.port}`);
    console.log(`   Environment: ${appConfig.app.nodeEnv}`);

    const app = await NestFactory.create(AppModule);

    // Setup Swagger
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    console.log(`📚 Swagger documentation available at: http://localhost:${appConfig.app.port}/api`);

    await app.listen(appConfig.app.port ?? 3000);
    console.log(`🚀 Application is running on: http://localhost:${appConfig.app.port}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
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
