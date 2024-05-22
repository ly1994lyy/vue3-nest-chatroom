export class ErrorCodeEnum {
  private readonly code: string;
  private readonly message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }

  public static SUCCESS = new ErrorCodeEnum('0000', 'Success');
  public static USER_EXISTED = new ErrorCodeEnum('10000', '用户已存在');
  public static USER_Login_Error = new ErrorCodeEnum(
    '10001',
    '用户不存在或者密码错误',
  );
  public static USER_NO_AUTH = new ErrorCodeEnum(
    '10002',
    '用户未登录或者登录已过期',
  );
}
