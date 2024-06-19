import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomGateway } from './chatroom.gateway';
import { FriendshipModule } from '../friendship/friendship.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { RedisService } from './redis.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [FriendshipModule, UserModule, MessageModule, GroupModule],
  providers: [ChatroomGateway, ChatroomService, RedisService],
})
export class ChatroomModule {}
