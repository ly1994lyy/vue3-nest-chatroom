export interface IMsg {
  formUsername: string
  sendTime: Date
  msg: string
}

export interface IMsgBox {
  userId: bigint
  msgList: IMsg[]
}

export interface IServerMSg {
  sendUserId: bigint
  sendUserName: string
  msg: string
  sendTime: Date
}
