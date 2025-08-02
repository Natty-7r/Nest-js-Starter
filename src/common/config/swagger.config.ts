import { DocumentBuilder } from '@nestjs/swagger';
import appConfig from './app.config';

const swaggerConfig = new DocumentBuilder()
  .setTitle(appConfig.app.appName)
  .setDescription(`${appConfig.app.appName.toLocaleUpperCase()} API description`)
  .setVersion('1.0')
  .build();

export default swaggerConfig;
