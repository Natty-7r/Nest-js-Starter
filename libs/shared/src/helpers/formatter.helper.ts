import { LogFileData, LogFileFolder, LogFileFormatterParams, LogType } from '../types/shared.type';
import { createDateFromString } from './date.helper';
import { getFullPath } from './file.helper';

// this methode atach log type to each file and return object of them
const formatLogFiles = async ({
  logType,
  fileNames,
}: LogFileFormatterParams): Promise<LogFileData[]> => {
  const filteredFiles = fileNames.filter((fileName) => fileName.includes('log'));
  const logFiles = await Promise.all(
    filteredFiles.map(async (fileName) => {
      const fullPath = await getFullPath({
        filePath: `/logs/${logType === LogType.ACTIVITY ? LogFileFolder.ACTIVITY : LogFileFolder.ERROR}/${fileName}`,
      });
      const date = createDateFromString(fileName.split('_')[0]);
      return { fullPath, date, logType, fileName };
    }),
  );
  return logFiles;
};

export default formatLogFiles;
