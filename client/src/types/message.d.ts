import type { User } from './user1'

export interface IMessage {
  id: bigint
  sender: User
  receiver: User
  content: string
  sentAt: Date
}

export interface IMessageBox {
  user: User
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
