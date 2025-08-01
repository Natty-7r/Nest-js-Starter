import { LoggerService } from '@app/logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './common/config/app.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(config.app.port ?? 3000, () => {
      LoggerService.nestLog(`App is running port ${config.app.port}`);
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
