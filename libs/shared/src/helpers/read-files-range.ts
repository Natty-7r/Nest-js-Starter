import * as fs from 'node:fs/promises';
import { basename } from 'node:path';
import { join } from 'path';
import CustomeException from '../exception/custome-exception';

/**
 * ! dates should be strings in YYYY-MM-DD format
 * ! endDate is optional ,so if not provided the files inside the directory will be all read
 */

async function readFile(
  dirName: string,
  startDate: string,
  endDate?: string,
  logCollections: Record<string, unknown>[] = [],
) {
  try {
    const logs = await fs.readdir(dirName);

    const results = await Promise.allSettled(
      logs.map(async (log) => {
        const logPath = join(dirName, log);
        const stats = await fs.stat(logPath);

        const fileNameParts = basename(logPath).split('-');
        fileNameParts.pop();
        const fileCreationDate = fileNameParts.join('-');

        // Process only .log files
        if (!log.endsWith('.log')) {
          return;
        }
        // validating date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fileCreationDate)) {
          throw new CustomeException(
            'file date format should not contain YYYY-MM-DD',
            400,
            'helper/readFile',
          );
        }

        // Check if file is within date range
        const isWithinDateRange = endDate
          ? fileCreationDate >= startDate && fileCreationDate <= endDate
          : fileCreationDate >= startDate;

        if (stats.isFile() && log.endsWith('.log') && stats.size > 0 && isWithinDateRange) {
          try {
            const content = await fs.readFile(logPath, 'utf8');
            const lines = content.split('\n').filter((line) => !!line.trim());
            lines.forEach((line) => {
              try {
                logCollections.push(JSON.parse(line) as Record<string, unknown>);
              } catch (error) {
                CustomeException.handle(error as Error, 'helper/readFile');
                throw error;
              }
            });
          } catch (error) {
            CustomeException.handle(error as Error, 'helper/readFile');
            throw error;
          }
        } else if (stats.isDirectory()) {
          await readFile(logPath, startDate, endDate, logCollections);
        }
      }),
    );

    results.forEach((result) => {
      if (result.status === 'rejected') {
        throw new CustomeException(
          `Error processing file: ${result.reason}`,
          400,
          'helper/readFile',
        );
      }
    });

    return logCollections;
  } catch (error) {
    CustomeException.handle(error as Error, 'helper/readFile');
    throw error;
  }
}

export default readFile;
