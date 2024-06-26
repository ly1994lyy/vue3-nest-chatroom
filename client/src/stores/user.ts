import { defineStore } from 'pinia'
import type { User } from '@/types/users'
import type { Group } from '@/types/group'

export const useUserStore = defineStore('user', {
  state() {
    return {
      // 当前登录的用户
      currentUser: {} as User,
      // 当前聊天窗口的对象用户
      currentMsgUser: {} as (User | Group),
      // 所有联系人
      friends: [] as (User | Group)[],
      // 所有好友请求
      addFriendReqList: [] as User[],
    }
  },
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user
    },
    setCurrentMsgUser(user: User | Group) {
      this.currentMsgUser = user
    },
    setFriends(friends: (User | Group)[]) {
      this.friends = friends
    },
    handleAddFriendReq(userId: bigint) {
      const handleUser = this.addFriendReqList.find(e => e.id === userId)
      if (handleUser)
        this.addFriendReqList = this.addFriendReqList.filter(e => e.id !== userId)
    },
    pushAddFriendReq(user: User) {
      this.addFriendReqList.push(user)
    },
  },
})
