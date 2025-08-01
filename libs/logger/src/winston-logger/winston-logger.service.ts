import { Injectable } from '@nestjs/common';

import { calculateTimeFrame, compareDates } from '@app/shared/helpers/date.helper';
import {
  getFullPath,
  readFileContent,
  readFileNamesInFolder,
} from '@app/shared/helpers/file.helper';
import formatLogFiles from '@app/shared/helpers/formatter.helper';
import { parseLogFile } from '@app/shared/helpers/parser.helper';
import {
  LogFile,
  LogFileData,
  LogFileFolder,
  LoggerType,
  LogType,
  TimeUnit,
} from '@app/shared/types/shared.type';
import * as Winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { FileLogQueryDto } from '../dto/file-log-query.dto';
import { LoggerStrategy } from './interfaces/logger-strategy.interface';

@Injectable()
export class WinstonLoggerService {
  private stragety: LoggerStrategy;

  private logger: Winston.Logger;

  loggerType: LoggerType;

  configure(stragety: LoggerStrategy) {
    this.stragety = stragety;
    this.loggerType = this.stragety.getLoggerType();

    // define logger ratation file based on logger type
    this.logger = Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        Winston.format.json(),
      ),
      transports: [
        new DailyRotateFile({
          datePattern: 'YYYY-MM-DD',
          maxSize: '20mb',
          maxFiles: '14d',
          ...this.stragety.getLoggerConfig(),
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      const consoleTransport = new Winston.transports.Console({
        format: Winston.format.combine(
          Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          Winston.format.simple(),
          Winston.format.colorize(),
        ),
      });
      this.logger.add(consoleTransport);
    }
  }

  log(message: string, metadata?: Record<string, unknown>) {
    this.logger.info(message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.logger.error(message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.logger.debug(message, metadata);
  }

  verbose(message: string, metadata?: Record<string, unknown>) {
    this.logger.verbose(message, metadata);
  }

  async getFileLogs(query: FileLogQueryDto) {
    if (query.logType) return this.readLogFile(query);
    return [
      {
        logType: LogType.ERROR,
        logs: await this.readLogFile({ ...query, logType: LogType.ERROR }),
      },
      {
        logType: LogType.ACTIVITY,
        logs: await this.readLogFile({ ...query, logType: LogType.ACTIVITY }),
      },
    ];
  }

  async readLogFile({
    logType = LogType.ERROR,
    endDate,
    startDate,
    timeUnit = TimeUnit.d,
    timeFrame = 1,
  }: FileLogQueryDto) {
    /* eslint-disable */
    const folderName = LogFileFolder[logType];
     
    let logFileDatas: LogFileData[] = [];
    let [initialDate, finalDate] = [new Date(), new Date()];

    // check end date or calculate time frame
    if (!endDate)
      [initialDate, finalDate] = calculateTimeFrame({
        startDate,
        timeFrame,
        timeUnit,
      });

    //  get log folder paths
    const logFolderPath = await getFullPath({
      filePath: `/logs/${folderName}`,
    });

    // read all log files
    const logFileNames = await readFileNamesInFolder({
      folderPath: logFolderPath,
    });

    logFileDatas.push(
      ...(await formatLogFiles({
        logType,
        fileNames: logFileNames,
      })),
    );

    // filter by time frame
    logFileDatas = logFileDatas
      .filter((logFileData) => {
        const stratDateComparation = compareDates(initialDate, logFileData.date);
        const endDateComparation = compareDates(finalDate, logFileData.date);

        return (
          (stratDateComparation === 1 || stratDateComparation === 0) &&
          (endDateComparation === 1 || endDateComparation === 0)
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // read log file content
    const rawLogs: LogFile[] = await Promise.all(
      logFileDatas.map(async (logFileData) => ({
        logType: logFileData.logType,
        content: await readFileContent({ filePath: logFileData.fullPath }),
      })),
    );

    // parse logs
    const logs = rawLogs
      .filter((rawLog) => rawLog.content.trim() !== '')
      .map((rawLog) => parseLogFile(rawLog))
      .flat();

    return logs;
  }
}
