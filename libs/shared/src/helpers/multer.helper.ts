import { BadRequestException, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { FileType, MulterFilterConfig, MulterStorageConfig } from '../types/shared.type';
import { changeSpaceByHypen } from './string.helper';

type MulterCallback = (error: Error | HttpException | null, acceptFile: boolean) => void;

export const multerFilter = ({ fileType, maxSize = 5, optional }: MulterFilterConfig) => {
  const mimeTypes: { [key in FileType]: string[] } = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    pdf: ['application/pdf'],
    txt: ['text/plain'],
    doc: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  };

  const allowedTypes = mimeTypes[fileType];

  return (req: Request, file: Express.Multer.File, callback: MulterCallback) => {
    // Ensure the file is an file format

    if (!optional && !file) {
      return callback(new BadRequestException('File cannot be empty!'), false);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException(`Only  ${fileType} files are allowed!`), false);
    }
    // Ensure the file is not empty

    if (file?.size > maxSize * 1024 * 1024) {
      return callback(new BadRequestException(`File cannot be exceed ${maxSize} MB.`), false);
    }
    return callback(null, true);
  };
};

export const muluterStorage = (
  { folder, filePrefix }: MulterStorageConfig = { folder: '/', filePrefix: '' },
) => {
  const storage = diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, cb) => {
      const name = file.originalname.split('.')[0];
      const extension = extname(file.originalname);
      cb(null, `${filePrefix}_${changeSpaceByHypen(name)}-${Date.now().toString()}${extension}`);
    },
  });

  return storage;
};

export default muluterStorage;
