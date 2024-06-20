import type { Group } from '@/types/group'
import type { User } from '@/types/users'

export function isGroup(val: Group | User) {
  return (val as Group).name !== undefined
}
