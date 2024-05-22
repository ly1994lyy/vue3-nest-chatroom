import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
