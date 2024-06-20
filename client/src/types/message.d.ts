import type { Group } from './group'
import type { User } from './users'

export interface IMessage {
  id: bigint
  sender: User
  receiver?: User
  group?: Group
  content: string
  sentAt: Date
}

export interface IMessageBox {
  user?: User
  group?: Group
  messages: IMessage[]
  unReadMessages: IMessage[]
}

enum OfflineMessageType {
  offlineMsg,
  addFriend,
}

export interface IOfflineMessage {
  type: OfflineMessageType
  messages: IMessage[]
}
