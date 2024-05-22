import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '@app/common/http-exception/api.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    if (exception instanceof ApiException) {
      response.status(HttpStatus.OK).json({
        code: exception.getErrorCode(),
        msg: exception.getErrorMsg(),
      });
      return;
    }
    const { message, statusCode } = exception.getResponse() as {
      message: string;
      statusCode: string;
    };
    response.status(status).json({
      code: statusCode,
      msg: message,
    });
  }
}
