import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserName(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }
}
