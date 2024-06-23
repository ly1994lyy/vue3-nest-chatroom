import { UserService } from '../user/user.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { Server, Socket } from 'socket.io';
import {
  handleFriendType,
  messageType,
  userInfoDto,
} from './dto/chatroom.model';
import * as process from 'process';
import { FriendshipService } from '../friendship/friendship.service';
import { MessageService } from '../message/message.service';
import { RedisService } from './redis.service';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { GroupService } from '../group/group.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CHATROOM_URL,
  },
})
export class ChatroomGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly friendshipService: FriendshipService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly redisService: RedisService,
    private readonly groupService: GroupService,
  ) {}

  @SubscribeMessage('online')
  async online(
    @MessageBody() onlineUser: userInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!onlineUser) {
      client.disconnect();
      return;
    }
    await this.redisService.storeSocketId(onlineUser.id, client.id);
    const { friends, messages, offlineMessage, groups } =
      await this.chatroomService.pushUserInfo(onlineUser.id);
    this.chatroomService.joinGroup(groups, client);
    return {
      friends,
      messages,
      offlineMessage,
      groups,
    };
  }

  @SubscribeMessage('offline')
  async offline(@MessageBody() id: bigint) {
    await this.redisService.delSocketId(id);
  }

  @SubscribeMessage('sendMsg')
  async sendMsg(@MessageBody() sendInfo: messageType) {
    await this.messageService.sendMessageToUser(
      sendInfo.sender.id,
      sendInfo.receiver.id,
      sendInfo.content,
    );
    const receiveSocketId = await this.redisService.getSocketId(
      sendInfo.receiver.id,
    );
    if (receiveSocketId) {
      const socket = this.server.sockets.sockets.get(receiveSocketId);
      socket.emit('receiveMsg', {
        ...sendInfo,
        sendAt: new Date(),
      });
    } else {
      await this.redisService.storeOfflineMessage(sendInfo.receiver.id, {
        ...sendInfo,
        sentAt: new Date(),
      });
    }
    return {
      ...sendInfo,
      sentAt: new Date(),
    };
  }

  @SubscribeMessage('sendGroupMsg')
  async sendGroupMsg(@MessageBody() sendInfo: messageType) {
    await this.messageService.sendMessageToGroup(
      sendInfo.sender.id,
      sendInfo.group.gId,
      sendInfo.content,
    );
    this.server.to(`group_${sendInfo.group.gId}`).emit('receiveMsg', {
      ...sendInfo,
      sendAt: new Date(),
    });
  }

  @SubscribeMessage('addFriendRequest')
  async addFriendRequest(@MessageBody() add: handleFriendType) {
    const receiveSocketId = await this.redisService.getSocketId(add.friendId);
    const user = await this.userService.findOneById(add.userId);
    if (receiveSocketId) {
      this.server.sockets.sockets
        .get(receiveSocketId)
        .emit('addFriendResponse', {
          user,
        });
    } else {
      await this.redisService.storeAddFriendRequestMessage(add.friendId, user);
    }
  }

  @SubscribeMessage('readMessage')
  async readMessage(@MessageBody() query: handleFriendType) {
    await this.redisService.clearOfflineMessages(query);
  }

  @SubscribeMessage('addFriend')
  async addFriend(@MessageBody() add: handleFriendType) {
    const userSocketId = await this.redisService.getSocketId(add.userId);
    const user = await this.userService.findOneById(add.friendId);
    if (!add.result) {
      if (userSocketId) {
        this.server.sockets.sockets.get(userSocketId).emit('addFriendResult', {
          result: false,
          user,
        });
        return;
      }
      return;
    }
    await this.friendshipService.addFriend(add.userId, add.friendId);
    const friendSocketId = await this.redisService.getSocketId(add.friendId);
    if (userSocketId) {
      const userClient = this.server.sockets.sockets.get(userSocketId);
      await this.chatroomService.pushUserInfo(add.userId, userClient);
      userClient.emit('addFriendResult', {
        result: true,
        user,
      });
    }
    if (friendSocketId) {
      const friendClient = this.server.sockets.sockets.get(friendSocketId);
      await this.chatroomService.pushUserInfo(add.friendId, friendClient);
    }
  }

  @SubscribeMessage('deleteFriend')
  async deleteFriend(@MessageBody() del: handleFriendType) {
    await this.friendshipService.removeFriend(del.userId, del.friendId);
    const userSocketId = await this.redisService.getSocketId(del.userId);
    const friendSocketId = await this.redisService.getSocketId(del.friendId);
    if (userSocketId) {
      await this.chatroomService.pushUserInfo(
        del.userId,
        this.server.sockets.sockets.get(userSocketId),
      );
    }
    if (friendSocketId) {
      await this.chatroomService.pushUserInfo(
        del.friendId,
        this.server.sockets.sockets.get(friendSocketId),
      );
    }
  }

  @SubscribeMessage('searchUser')
  async searchUser(@MessageBody() userName: string) {
    const user = await this.userService.findUserByName(userName);
    return {
      data: user,
    };
  }

  @SubscribeMessage('createGroup')
  async createGroup(@MessageBody() createGroupDto: CreateGroupDto) {
    const groups = await this.groupService.createGroup(createGroupDto);
    return {
      data: groups,
    };
  }
}
