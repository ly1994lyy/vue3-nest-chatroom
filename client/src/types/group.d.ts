import type { User } from './users'

export interface Group {
  gId: bigint
  name: string
  members: User[]
  createdAt: Date
  updatedAt: Date
}
