import { LoggerService } from '@libs/logger';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import appConfig from './common/config/app.config';
import swaggerConfig from './common/config/swagger.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    await app.listen(appConfig.app.port ?? 3000, () => {
      LoggerService.nestLog(`App is running port ${appConfig.app.port}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Use Logger instead of console in production
      process.stdout.write(`Error: ${error.message}\n`);
      process.stdout.write(`Stack: ${error.stack}\n`);
    } else {
      process.stdout.write('Unknown error occurred\n');
    }
    process.exit(1);
  }
}

void bootstrap();
