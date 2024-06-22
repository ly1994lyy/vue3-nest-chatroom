import type { Group } from '@/types/group'
import type { User } from '@/types/users'

export function isGroup(val: Group | User) {
  return (val as Group).gId !== undefined
}

export function isUser(val: Group | User) {
  return (val as User).id !== undefined
}
