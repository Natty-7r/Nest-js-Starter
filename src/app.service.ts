import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { marked } from 'marked';
import { getFileContent } from './utils/helpers/file.helper';

@Injectable()
export class AppService {
  async getReadme(): Promise<string> {
    try {
      const content = await getFileContent({ filePath: 'README.md' });
      return await marked.parse(content);
    } catch (err) {
      throw new InternalServerErrorException('Unable to read README file');
    }
  }
}
