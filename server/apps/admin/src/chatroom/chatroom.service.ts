import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { Socket } from 'socket.io';
import { FriendshipService } from '../friendship/friendship.service';
import { RedisService } from './redis.service';
import { GroupService } from '../group/group.service';
import { Group } from '../group/entities/group.entity';

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
    const groupsMses = await this.messageService.getMessageForGroup(userId);
    const offlineMessage = await this.redisService.getOfflineMessage(userId);
    const friends = await this.friendshipService.getFriends(userId);
    const groups = await this.groupService.findGroupById(userId);
    if (client) {
      client.emit('getUserInfo', {
        messages: [...messages, ...groupsMses],
        offlineMessage,
        friends,
        groups,
      });
    }
    return {
      messages: [...messages, ...groupsMses],
      offlineMessage,
      friends,
      groups,
    };
  }

  joinGroup(groups: Group[], client: Socket) {
    groups.forEach((group) => {
      client.join(`group_${group.gId}`);
    });
  }
}
