import { basename } from 'path';
import {
  ActivityLogData,
  ErrorLogData,
  LogFile,
  LogType,
  StackTraceInfo,
} from '../types/shared.type';

export const parseStackTrace = (stack: string): StackTraceInfo => {
  const lines = stack.split('\n');
  const [type] = lines[0].split(':');
  const errorType = type;

  const stackInfo: StackTraceInfo = {
    fileName: '',
    row: '',
    col: '',
    errorType,
  };

  const stackTracePattern = /at .+ \(([^:]+):(\d+):(\d+)\)/;
  const match = lines[1].match(stackTracePattern);

  if (match) {
    const [, filePath, row, col] = match;
    stackInfo.fileName = basename(filePath);
    stackInfo.row = row;
    stackInfo.col = col;
  }
  return stackInfo;
};

export const parseActivityFileLog = (logCotent: string): ActivityLogData[] => {
  const logEntries = logCotent.split('\n').filter(Boolean);
  return logEntries.map((logEntry) => {
    const parsedLog = JSON.parse(logEntry) as ActivityLogData;
    return {
      id: parsedLog.id,
      level: parsedLog?.level,
      message: parsedLog?.message || 'No message',
      method: parsedLog?.method,
      status: parsedLog?.status,
      url: parsedLog?.url,
      timestamp: new Date(parsedLog?.timestamp)?.toLocaleString(), // Convert to local date string
      res: parsedLog?.res,
      ip: parsedLog?.ip,
    };
  });
};
export const parseErrorFileLog = (logCotent: string): ErrorLogData[] => {
  const logEntries = logCotent.split('\n').filter(Boolean);
  return logEntries.map((logEntry) => {
    const parsedLog = JSON.parse(logEntry) as ErrorLogData;
    return {
      id: parsedLog.id,
      level: parsedLog?.level,
      message: parsedLog?.message || 'No message',
      method: parsedLog?.method,
      status: parsedLog?.status,
      url: parsedLog?.url,
      timestamp: new Date(parsedLog?.timestamp)?.toLocaleString(), // Convert to local date string
      errorType: parsedLog?.errorType,
      fileName: parsedLog?.fileName,
      row: parsedLog?.row,
      col: parsedLog?.col,
      stack: parsedLog?.stack,
      ip: parsedLog?.ip,
    };
  });
};

export const parseLogFile = ({ content, logType }: LogFile) => {
  if (logType === LogType.ACTIVITY) return parseActivityFileLog(content);
  return parseErrorFileLog(content);
};
