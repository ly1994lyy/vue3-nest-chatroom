export interface User {
  id: bigint
  username: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}

export interface IUserInfo {
  friends: User[]
  messages: IMessage[]
  offlineMessage: IMessage[]
}
