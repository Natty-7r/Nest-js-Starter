export enum TimeUnit {
  h = 'h',
  d = 'd',
  w = 'w',
  m = 'm',
  y = 'y',
}

export type TimeFrameParams = {
  timeUnit: TimeUnit;
  timeFrame: number;
  startDate?: Date;
};

export type BaseFilePathParams = {
  filePath: string;
};
export type BaseFolderPathParams = {
  folderPath: string;
};

export type MulterStorageConfig = {
  folder: string;
  filePrefix: string;
};

export type FileType = 'image' | 'pdf' | 'txt' | 'doc';

export type MulterFilterConfig = {
  fileType: FileType;
  maxSize: number; // in MB
  optional?: boolean;
};

export type PaginationOptions = {
  page?: number | string;
  itemsPerPage?: number | string;
};
type AnyObject = { [key: string]: any };

export type SelectOption<T> = {
  [K in keyof T]?: boolean;
} & { [key: string]: any };
export type IncludesOption<T> = {
  [K in keyof T]?: boolean | IncludesOption<T[K]>;
} & AnyObject;

export type OrderByOption<T> = {
  [K in keyof T]?: 'asc' | 'desc';
} & AnyObject;

export type Condition<T> = {
  [K in keyof T]?: T[K] | Condition<T[K]>;
} & { deletedAt?: Date } & AnyObject;

export type SelectionOptions<T> = {
  select?: SelectOption<T>;
  include?: IncludesOption<T>;
  orderBy?: OrderByOption<T>[];
  condition?: Condition<T>;
};

export type PaginatorParams<T> = {
  model: any;

  pageOptions: PaginationOptions;
  selectionOption?: SelectionOptions<T>;
};

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    itemsPerPage: number;

    total: number;
    lastPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type StackTraceInfo = {
  fileName?: string;
  row?: string;
  errorType?: string;
  col?: string;
};

export type LogData = {
  id: string;
  method: string;
  ip: string;
  url: string;
  status: number;
  timestamp: string;
  level: string;
  message?: string;
};
export type LogFileFormatterParams = {
  logType: LogType;
  fileNames: string[];
};
export enum LogType {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  ACTIVITY = 'ACTIVITY',
}
export enum LoggerType {
  ACTIVITY = 'ACTIVITY',
  ERROR = 'ERROR',
}

export type LogFileData = {
  logType: LogType;
  fileName: string;
  fullPath: string;
  date: Date;
};

export enum LogFileFolder {
  ACTIVITY = 'activities',
  ERROR = 'errors',
}

export type ActivityLogData = LogData & {
  res: Record<string, unknown>;
};
export type ErrorLogData = LogData & {
  stack: Record<string, unknown>;
} & StackTraceInfo;

export type LogFile = {
  logType: LogType;
  content: string;
};

export type LoggerOption = {
  level: string;
  dirname?: string;
  filename: string;
};
