import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { FriendshipModule } from './friendship/friendship.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    ChatroomModule,
    FriendshipModule,
    GroupModule,
    MessageModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
