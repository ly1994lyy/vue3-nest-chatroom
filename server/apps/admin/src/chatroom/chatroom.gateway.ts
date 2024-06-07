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
import { addFriendType, sendMsgType, userInfoDto } from './dto/chatroom.model';
import * as process from 'process';
import { FriendshipService } from '../friendship/friendship.service';
import { MessageService } from '../message/message.service';
import { RedisService } from './redis.service';

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
  ) {}

  @SubscribeMessage('online')
  async online(
    @MessageBody() onlineUser: userInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const friends = await this.friendshipService.getFriends(onlineUser.id);
    await this.redisService.storeSocketId(onlineUser.id, client.id);
    const message = await this.messageService.getMessagesForUser(onlineUser.id);
    const offlineMessage = await this.redisService.getOfflineMessage(
      onlineUser.id,
    );
    await this.redisService.clearOfflineMessages(onlineUser.id);
    return {
      friends,
      message,
      offlineMessage,
    };
  }

  @SubscribeMessage('offline')
  async offline(@MessageBody() id: bigint) {
    await this.redisService.delSocketId(id);
  }

  @SubscribeMessage('sendMsg')
  async sendMsg(@MessageBody() sendInfo: sendMsgType) {
    await this.messageService.sendMessageToUser(
      sendInfo.fromUserId,
      sendInfo.toUserId,
      sendInfo.msg,
    );
    const receiveSocketId = await this.redisService.getSocketId(
      sendInfo.toUserId,
    );
    if (receiveSocketId) {
      const socket = this.server.sockets.sockets.get(receiveSocketId);
      socket.emit('receiveMsg', {
        sendUserId: sendInfo.fromUserId,
        sendUserName: sendInfo.fromUsername,
        msg: sendInfo.msg,
        sendTime: sendInfo.sendTime,
      });
    } else {
      await this.redisService.storeOfflineMessage(sendInfo.toUserId, sendInfo);
    }
  }

  @SubscribeMessage('addFriendRequest')
  async addFriendRequest(@MessageBody() add: addFriendType) {
    const receiveSocketId = await this.redisService.getSocketId(add.friendId);
    const user = await this.userService.findOneById(add.userId);
    console.log(user);
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

  @SubscribeMessage('addFriend')
  async addFriend(@MessageBody() add: addFriendType) {
    console.log(add);
    await this.friendshipService.addFriend(add.userId, add.friendId);
  }

  @SubscribeMessage('searchUser')
  async searchUser(@MessageBody() userName: string) {
    const user = await this.userService.findUserByName(userName);
    return {
      data: user,
    };
  }
}
