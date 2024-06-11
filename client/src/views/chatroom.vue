<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import { onMounted, ref } from 'vue'
import { Send } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { IMessage } from '@/types/message'
import { useMessageStore } from '@/stores/message'

interface IProp {
  socket: Socket
}
const props = defineProps<IProp>()
const emits = defineEmits(['localSendMsg', 'serverSendMsg'])

const userStore = useUserStore()
const messageStore = useMessageStore()
const router = useRouter()

const msg = ref('')
props.socket.on('receiveMsg', (data) => {
  emits('serverSendMsg', data)
})

function send() {
  props.socket.emit('sendMsg', {
    sender: userStore.currentUser,
    receiver: userStore.currentMsgUser,
    content: msg.value,
    sentAt: new Date(),
  } as IMessage)
  messageStore.receiveMessage({
    sender: userStore.currentUser,
    receiver: userStore.currentMsgUser,
    content: msg.value,
    sentAt: new Date(),
  } as IMessage)
  msg.value = ''
}

onMounted(() => {
  if (localStorage.getItem('user'))
    userStore.setCurrentUser(JSON.parse(localStorage.getItem('user')!))
  else
    router.push('/login')
})
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
  <div v-if="userStore.currentMsgUser.id" class="flex-1 p-20">
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
