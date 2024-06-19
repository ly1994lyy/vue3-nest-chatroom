import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { Socket } from 'socket.io';
import { FriendshipService } from '../friendship/friendship.service';
import { RedisService } from './redis.service';
import { GroupService } from '../group/group.service';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly friendshipService: FriendshipService,
    private readonly messageService: MessageService,
    private readonly redisService: RedisService,
    private readonly groupService: GroupService,
  ) {}

  //推送用户所有信息
  async pushUserInfo(userId: bigint, client?: Socket) {
    const messages = await this.messageService.getMessagesForUser(userId);
    const offlineMessage = await this.redisService.getOfflineMessage(userId);
    const friends = await this.friendshipService.getFriends(userId);
    const groups = await this.groupService.findGroupById(userId);
    if (client) {
      client.emit('getUserInfo', {
        messages,
        offlineMessage,
        friends,
        groups,
      });
    }
    return {
      messages,
      offlineMessage,
      friends,
      groups,
    };
  }
}
