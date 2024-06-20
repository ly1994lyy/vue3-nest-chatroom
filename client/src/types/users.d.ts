import type { Group } from './group'

export interface User {
  id: bigint
  username: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}

export interface IUserInfo {
  friends: User[]
  groups: Group[]
  messages: IMessage[]
  offlineMessage: IMessage[]
}
