export type userInfoDto = {
  username: string;
  id: bigint;
};

export type onlineUserDto = userInfoDto & { socketId: string };

export type sendMsgType = {
  fromUsername: string;
  fromUserId: bigint;
  toUserId: bigint;
  sendTime: Date;
  msg: string;
};

export type addFriendType = {
  userId: bigint;
  friendId: bigint;
};
