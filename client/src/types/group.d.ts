export interface Group {
  id: bigint
  name: string
  members: User[]
  createdAt: Date
  updatedAt: Date
}
