import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ApiException } from '@app/common/http-exception/api.exception';
import { ErrorCodeEnum } from '@app/common/enums/errorCodeEnum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new ApiException(ErrorCodeEnum.USER_Login_Error);
    }
    return user;
  }
}
