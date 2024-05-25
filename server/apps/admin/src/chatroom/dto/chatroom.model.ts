export type userInfoDto = {
  username: string;
  id: string;
};

export type onlineUserDto = userInfoDto & { socketId: string };

export type sendMsgType = {
  fromUsername: string;
  fromUserId: string;
  toUserId: string;
  sendTime: Date;
  msg: string;
};
