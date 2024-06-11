import { defineStore } from 'pinia'
import type { User } from '@/types/users'

export const useUserStore = defineStore('user', {
  state() {
    return {
      // 当前登录的用户
      currentUser: {} as User,
      // 当前聊天窗口的对象用户
      currentMsgUser: {} as User,
      // 所有联系人
      friends: [] as User[],
    }
  },
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user
    },
    setCurrentMsgUser(user: User) {
      this.currentMsgUser = user
    },
    setFriends(friends: User[]) {
      this.friends = friends
    },
  },
})
