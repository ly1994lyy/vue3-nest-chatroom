import { Group } from '../../group/entities/group.entity';
import { User } from '../../user/entities/user.entity';

export type userInfoDto = {
  username: string;
  id: bigint;
};

export type messageType = {
  id?: bigint;
  sender: User;
  receiver?: User;
  group?: Group;
  content: string;
  sentAt: Date;
};

export type handleFriendType = {
  userId: bigint;
  friendId?: bigint;
  groupId?: bigint;
  result?: boolean;
};
