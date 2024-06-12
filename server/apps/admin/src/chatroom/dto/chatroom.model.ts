import { User } from '../../user/entities/user.entity';

export type userInfoDto = {
  username: string;
  id: bigint;
};

export type onlineUserDto = userInfoDto & { socketId: string };

export type messageType = {
  id?: bigint;
  sender: User;
  receiver: User;
  content: string;
  sentAt: Date;
};

export type handleFriendType = {
  userId: bigint;
  friendId: bigint;
  result?: boolean;
};
