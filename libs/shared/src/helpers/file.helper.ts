import * as fsAsync from 'fs/promises';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseFilePathParams, BaseFolderPathParams } from '../types/shared.type';
import CustomeException from '../exception/custome-exception';

// base fs functions

const getCwd = () => process.cwd();
const ensureFilePath = async ({ filePath }: BaseFilePathParams) => {
  try {
    await fsAsync.access(filePath);
    return filePath;
  } catch (error) {
    const dir = path.dirname(filePath);
    await fsAsync.mkdir(dir, { recursive: true }); // Ensure the parent directory exists
    await fsAsync.writeFile(filePath, '');
    throw new InternalServerErrorException('Error reading folder:', error as Error);
    return filePath;
  }
};
export const getFullPath = async ({ filePath }: BaseFilePathParams) => {
  const fullPath = path.join(getCwd(), filePath);
  return ensureFilePath({ filePath: fullPath });
};

export const deleteFileAsync = async ({ filePath }: BaseFilePathParams) => {
  try {
    const fullPath = await getFullPath({ filePath });
    void fsAsync.unlink(fullPath);
  } catch (error) {
    CustomeException.handle(error as Error);
  }
};

export const readFileNamesInFolder = async ({
  folderPath,
}: BaseFolderPathParams): Promise<string[]> => {
  try {
    const files = await fsAsync.readdir(folderPath);
    return files.map((file) => path.basename(file));
  } catch (error) {
    throw new InternalServerErrorException('Error reading folder:', error as Error);
    return [];
  }
};

export const readFileContent = async ({ filePath }: BaseFilePathParams) => {
  const fullPath = await getFullPath({ filePath });
  return fsAsync.readFile(fullPath, 'utf8');
};
export const getFileContent = async ({ filePath }: BaseFilePathParams) => {
  const fullPath = await getFullPath({ filePath });
  return fsAsync.readFile(fullPath, 'utf8');
};
