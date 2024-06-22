export interface Group {
  gId: bigint
  name: string
  members: User[]
  createdAt: Date
  updatedAt: Date
}
