import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return {
      user: req.user,
      token: this.jwtService.sign(req.user.id),
    };
  }
}
