<script setup lang="ts">
import { ref } from 'vue'
import { Send } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import type { IMessage } from '@/types/message'
import { useMessageStore } from '@/stores/message'
import { useSocket } from '@/hooks/useSocket'

const { socket } = useSocket()

const userStore = useUserStore()
const messageStore = useMessageStore()

const msg = ref('')
socket.on('receiveMsg', (data) => {
  messageStore.receiveMessage(data)
})

function send() {
  socket.emit('sendMsg', {
    sender: userStore.currentUser,
    receiver: userStore.currentMsgUser,
    content: msg.value,
    sentAt: new Date(),
  } as IMessage, (data: IMessage) => {
    messageStore.receiveMessage(data)
  })
  msg.value = ''
}
</script>

<template>
  <div v-if="userStore.currentMsgUser.id" class="h-60 b-b-solid b-b-2 border-b-coolGray flex items-center px-20 justify-between">
    <div class="flex items-center">
      <n-avatar
        round
        size="small"
        :src="userStore.currentMsgUser.avatar"
      />
      <div class="ml-10">
        {{ userStore.currentMsgUser.username }}
      </div>
    </div>
  </div>
  <div v-if="userStore.currentMsgUser.id" class="flex-1 p-20 overflow-auto">
    <div v-for="(i, index) in messageStore.currentMsgList" :key="index" class="my-10">
      <div :class="`flex ${i.sender.id === userStore.currentUser.id ? 'flex-row-reverse' : ''}`">
        {{ i.sender.username }}({{ i.sentAt }}):
      </div>
      <div :class="`flex ${i.sender.id === userStore.currentUser.id ? 'flex-row-reverse' : ''}`">
        {{ i.content }}
      </div>
    </div>
  </div>
  <div v-if="userStore.currentMsgUser.id" class="h-60 px-20 flex items-center">
    <n-input v-model:value="msg" round placeholder="发送信息" @keyup.enter="send">
      <template #suffix>
        <n-icon :component="Send" />
      </template>
    </n-input>
  </div>
</template>

<style scoped>

</style>
