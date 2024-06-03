export interface onlineUser {
  username: string
  id: string
  socketId: number
  avatar: string
}

export interface IMsg {
  formUsername: string
  sendTime: Date
  msg: string
}

export interface IMsgBox {
  userId: string
  msgList: IMsg[]
}

export interface IServerMSg {
  sendUserId: string
  sendUserName: string
  msg: string
  sendTime: Date
}
