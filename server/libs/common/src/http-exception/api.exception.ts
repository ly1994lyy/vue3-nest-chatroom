import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodeEnum } from '@app/common/enums/errorCodeEnum';

export class ApiException extends HttpException {
  private readonly apiError: ErrorCodeEnum;

  constructor(apiError: ErrorCodeEnum, status = HttpStatus.OK) {
    super(apiError.getMessage(), status);
    this.apiError = apiError;
  }

  getErrorCode() {
    return this.apiError.getCode();
  }

  getErrorMsg() {
    return this.apiError.getMessage();
  }
}
