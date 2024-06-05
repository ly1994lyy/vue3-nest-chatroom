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
  ) {}

  @SubscribeMessage('online')
  async online(
    @MessageBody() onlineUser: userInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.onlineUserList.find((e) => e.id === onlineUser.id);
    const friends = await this.friendshipService.getFriends(onlineUser.id);
    if (user) {
      user.socketId = client.id;
    } else {
      this.onlineUserList.push({ ...onlineUser, socketId: client.id });
    }
    const message = await this.messageService.getMessagesForUser(onlineUser.id);
    // client.broadcast.emit('onlineUserList', this.onlineUserList);
    return {
      data: friends,
      message,
    };
  }

  @SubscribeMessage('offline')
  offline(@MessageBody() id: bigint, @ConnectedSocket() client: Socket) {
    const user = this.onlineUserList.find((e) => e.id === id);
    if (user) {
      this.onlineUserList = this.onlineUserList.filter((e) => e.id !== id);
    }
    client.broadcast.emit('onlineUserList', this.onlineUserList);
  }

  @SubscribeMessage('sendMsg')
  sendMsg(@MessageBody() sendInfo: sendMsgType) {
    const user = this.onlineUserList.find((e) => e.id === sendInfo.toUserId);
    if (user) {
      const targetId = user.socketId;
      const socket = this.server.sockets.sockets.get(targetId);
      this.messageService.sendMessageToUser(
        sendInfo.fromUserId,
        sendInfo.toUserId,
        sendInfo.msg,
      );
      socket.emit('receiveMsg', {
        sendUserId: sendInfo.fromUserId,
        sendUserName: sendInfo.fromUsername,
        msg: sendInfo.msg,
        sendTime: sendInfo.sendTime,
      });
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
