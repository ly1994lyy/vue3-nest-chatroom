import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, ChatroomModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
