import type { User } from './user1'

export interface IOfflineMessage {
  id: bigint
  sender: User
  receiver: User
  content: string
  sentAt: Date
}

export interface IMessageBox {
  user: User
  messages: IOfflineMessage[]
}
