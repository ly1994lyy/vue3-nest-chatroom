import type { User } from './users'

export interface Group {
  gId: bigint
  name: string
  createdBy: User
  members: User[]
  createdAt: Date
  updatedAt: Date
}
