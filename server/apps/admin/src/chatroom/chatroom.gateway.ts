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
  addFriendType,
  onlineUserDto,
  sendMsgType,
  userInfoDto,
} from './dto/chatroom.model';
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
  private onlineUserList: onlineUserDto[] = [];

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
    const user = this.onlineUserList.find((e) => e.id === onlineUser.id);
    const friends = await this.friendshipService.getFriends(onlineUser.id);
    this.redisService.storeSocketId(onlineUser.id, client.id);
    if (user) {
      user.socketId = client.id;
    } else {
      this.onlineUserList.push({ ...onlineUser, socketId: client.id });
    }
    const message = await this.messageService.getMessagesForUser(onlineUser.id);
    const offlineMessaga = await this.redisService.getOfflineMessage(
      onlineUser.id,
    );
    await this.redisService.clearOfflineMessages(onlineUser.id);
    // client.broadcast.emit('onlineUserList', this.onlineUserList);
    return {
      data: friends,
      message,
      offlineMessaga,
    };
  }

  @SubscribeMessage('offline')
  offline(@MessageBody() id: bigint, @ConnectedSocket() client: Socket) {
    const user = this.onlineUserList.find((e) => e.id === id);
    this.redisService.delSocketId(id);
    if (user) {
      this.onlineUserList = this.onlineUserList.filter((e) => e.id !== id);
    }
    client.broadcast.emit('onlineUserList', this.onlineUserList);
  }

  @SubscribeMessage('sendMsg')
  async sendMsg(@MessageBody() sendInfo: sendMsgType) {
    this.messageService.sendMessageToUser(
      sendInfo.fromUserId,
      sendInfo.toUserId,
      sendInfo.msg,
    );
    const receiveScoketId = await this.redisService.getSocketId(
      sendInfo.toUserId,
    );
    if (receiveScoketId) {
      const socket = this.server.sockets.sockets.get(receiveScoketId);
      socket.emit('receiveMsg', {
        sendUserId: sendInfo.fromUserId,
        sendUserName: sendInfo.fromUsername,
        msg: sendInfo.msg,
        sendTime: sendInfo.sendTime,
      });
    } else {
      this.redisService.storeOfflineMessage(sendInfo.toUserId, sendInfo);
    }
  }

  @SubscribeMessage('addFriend')
  addFriend(@MessageBody() add: addFriendType) {
    console.log(add.friendId);
  }

  @SubscribeMessage('searchUser')
  async searchUser(@MessageBody() userName: string) {
    const user = await this.userService.findUserName(userName);
    return {
      data: user,
    };
  }
}
