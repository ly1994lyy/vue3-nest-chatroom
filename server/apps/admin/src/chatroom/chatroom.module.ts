import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomGateway } from './chatroom.gateway';
import { FriendshipModule } from '../friendship/friendship.module';

@Module({
  imports: [FriendshipModule],
  providers: [ChatroomGateway, ChatroomService],
})
export class ChatroomModule {}
