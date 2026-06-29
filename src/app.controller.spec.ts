import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return README content as HTML', async () => {
      const result = '<h1>NestJS Starter</h1>';
      jest.spyOn(appService, 'getReadme').mockResolvedValue(result);

      expect(await appController.getReadme()).toBe(result);
    });
  });
});
