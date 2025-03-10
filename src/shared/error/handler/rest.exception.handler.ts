import { HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { LogicalException } from '../exception/logical.exception';
import { ErrorSpecification, getErrorSpecificationDetails } from '../specs/error-specification';
import { ErrorResponse } from '../model/error.response';
import { Error } from '../model/error';
import { ValidationException } from '../exception/validation.exception';
@Catch()
export class RestExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(RestExceptionHandler.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof LogicalException) {
      this.handleLogicalException(exception, response);
    } else if (exception instanceof ValidationException) {
      this.handleValidationErrorException(exception, response);
    } else {
      this.handleUnknownException(exception, response);
    }
  }

  private handleLogicalException(exception: LogicalException, response: Response) {
    this.logger.error(exception.message, exception.stack);

    const errorSpec = exception.errorSpecification;
    const details = getErrorSpecificationDetails(errorSpec);
    const error = new Error(details.code, exception.message, details.target, undefined, undefined);
    const errorResponse = new ErrorResponse(error);
    response.status(exception.getHttpStatus()).json(errorResponse);
  }

  private handleValidationErrorException(exception: ValidationException, response: Response) {
    this.logger.error(exception.message, exception.details);

    const error = new Error(
      'InputValidationError',
      exception.message,
      undefined,
      exception.getDetails(),
      undefined
    );
    const errorResponse = new ErrorResponse(error);
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  private handleUnknownException(exception: unknown, response: Response) {
    this.logger.error('Unknown error occurred', exception);

    const errorSpec = getErrorSpecificationDetails(ErrorSpecification.UNKNOWN);
    const error = new Error(
      errorSpec.code,
      'An unexpected error occurred',
      errorSpec.target,
      undefined,
      undefined
    );
    const errorResponse = new ErrorResponse(error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
