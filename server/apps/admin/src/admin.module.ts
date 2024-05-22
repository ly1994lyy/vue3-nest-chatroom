import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
