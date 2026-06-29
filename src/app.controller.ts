import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/')
  async getReadme(): Promise<string> {
    return this.appService.getReadme();
  }
}
