import { defineStore } from 'pinia'
import { useUserStore } from './user'
import type { IMessage, IMessageBox } from '@/types/message'

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
      return state.msgList.find(e => e.user.id === userStore.currentMsgUser.id)?.messages || []
    },
  },
  actions: {
    receiveMessage(msg: IMessage) {
      const user = this.msgList.find(e => e.user.id === msg.sender.id)
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
    },
    addNewMsgList(msg: IMessageBox) {
      this.msgList.push(msg)
    },
  },
})
