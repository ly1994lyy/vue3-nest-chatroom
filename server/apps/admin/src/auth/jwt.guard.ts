import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiException } from '@app/common/http-exception/api.exception';
import { ErrorCodeEnum } from '@app/common/enums/errorCodeEnum';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: HttpException, user: any) {
    if (err || !user) {
      throw new ApiException(ErrorCodeEnum.USER_NO_AUTH);
    }
    return user;
  }
}
