import { HttpException, HttpStatus } from '@nestjs/common';
import ErrorMessages from '../maps/error.map';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export default class CustomeException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, property: string = '') {
    super(
      {
        message,
        property,
      },
      statusCode,
    );
  }

  static handle(error: Error, property?: string) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
        case 'P2016':
          throw new CustomeException(ErrorMessages.notFound, HttpStatus.NOT_FOUND, property);
        case 'P2021':
          throw new CustomeException(
            ErrorMessages.databaseConnectionError,
            HttpStatus.INTERNAL_SERVER_ERROR,
            property,
          );
        case 'P2002':
          throw new CustomeException(ErrorMessages.exists, HttpStatus.CONFLICT, property);
        default:
          throw new CustomeException(error.message, HttpStatus.BAD_REQUEST, property);
      }
    } else if (error instanceof CustomeException) {
      throw error;
    } else {
      throw new CustomeException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        property,
      );
    }
  }
}
