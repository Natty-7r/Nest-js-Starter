
import * as fsAsync from 'fs/promises';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';

export type BaseFilePathParams = {
    filePath: string;
};

export type BaseFolderPathParams = {
    folderPath: string;
};

const getCwd = () => {
    return process.cwd();
};

const ensureFilePath = async ({ filePath }: BaseFilePathParams) => {
    try {
        await fsAsync.access(filePath);
        return filePath;
    } catch (error) {
        const dir = path.dirname(filePath);
        await fsAsync.mkdir(dir, { recursive: true });
        await fsAsync.writeFile(filePath, '');
        return filePath;
    }
};

export const getFullPath = async ({ filePath }: BaseFilePathParams) => {
    const fullPath = path.join(getCwd(), filePath);
    return ensureFilePath({ filePath: fullPath });
};

export const deleteFileAsync = async ({ filePath }: BaseFilePathParams) => {
    const fullPath = await getFullPath({ filePath });
    await fsAsync.unlink(fullPath);
};

export const readFileNamesInFolder = async ({
    folderPath,
}: BaseFolderPathParams): Promise<string[]> => {
    try {
        const files = await fsAsync.readdir(folderPath);
        return files.map((file) => path.basename(file));
    } catch (error) {
        throw new InternalServerErrorException('Error reading folder:', error as Error);
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