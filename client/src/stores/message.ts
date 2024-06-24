import { defineStore } from 'pinia'
import { useUserStore } from './user'
import type { IMessage, IMessageBox } from '@/types/message'
import { isGroup, isUser } from '@/utils/util'
import type { Group } from '@/types/group'
import type { User } from '@/types/users'

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      // 和所有好友的聊天记录集合
      msgList: [] as IMessageBox[],
    }
  },
  getters: {
    currentMsgList(state) {
      const userStore = useUserStore()
      if (isGroup(userStore.currentMsgUser))
        return state.msgList.find(e => e.group?.gId === (userStore.currentMsgUser as Group).gId)?.messages || []
      if (isUser(userStore.currentMsgUser))
        return state.msgList.find(e => e.user?.id === (userStore.currentMsgUser as User).id)?.messages || []
      return []
    },
  },
  actions: {
    receiveMessage(msg: IMessage) {
      if (msg.group?.gId) {
        const group = this.msgList.find(e => e.group?.gId === msg.group?.gId)
        if (group) {
          group.messages.push(msg)
        }
        else {
          this.addNewMsgList({
            group: msg.group,
            messages: [msg],
            unReadMessages: [],
          })
        }
      }
      else {
        const user = this.msgList.find(e => e.user?.id === msg.sender.id || e.user?.id === msg.receiver?.id)
        if (user) {
          user.messages.push(msg)
        }
        else {
          this.addNewMsgList({
            user: msg.receiver,
            messages: [msg],
            unReadMessages: [],
          })
        }
      }
    },
    addNewMsgList(msg: IMessageBox) {
      this.msgList.push(msg)
    },
    readMessage() {
      const userStore = useUserStore()
      if (!isGroup(userStore.currentMsgUser)) {
        if ((userStore.currentMsgUser as User).id) {
          const user = this.msgList.find(e => e.user?.id === (userStore.currentMsgUser as User).id)
          if (user)
            user.unReadMessages = []
        }
      }
      else {
        if ((userStore.currentMsgUser as Group).gId) {
          const group = this.msgList.find(e => e.group?.gId === (userStore.currentMsgUser as Group).gId)
          if (group)
            group.unReadMessages = []
        }
      }
    },
  },
})
