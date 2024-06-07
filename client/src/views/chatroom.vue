<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import { onMounted, ref } from 'vue'
import { Send } from '@vicons/ionicons5'
import type { User } from '@/types/users'
import type { IOfflineMessage } from '@/types/message'

interface IProp {
  currentMsgUser: User
  socket: Socket
  currentMsgList: IOfflineMessage[]
}
const props = defineProps<IProp>()

const emits = defineEmits(['localSendMsg', 'serverSendMsg'])

const msg = ref('')
props.socket.on('receiveMsg', (data) => {
  emits('serverSendMsg', data)
})

const currentUser = ref<User>({} as User)

function send() {
  props.socket.emit('sendMsg', {
    sender: currentUser.value,
    receiver: props.currentMsgUser,
    content: msg.value,
    sentAt: new Date(),
  } as IOfflineMessage)
  emits('localSendMsg', {
    sender: currentUser.value,
    receiver: props.currentMsgUser,
    content: msg.value,
    sentAt: new Date(),
  } as IOfflineMessage)
  msg.value = ''
}

onMounted(() => {
  currentUser.value = history.state.user
})
</script>

<template>
  <div v-if="currentMsgUser.id" class="h-60 b-b-solid b-b-2 border-b-coolGray flex items-center px-20 justify-between">
    <div class="flex items-center">
      <n-avatar
        round
        size="small"
        :src="currentMsgUser.avatar"
      />
      <div class="ml-10">
        {{ currentMsgUser.username }}
      </div>
    </div>
  </div>
  <div v-if="currentMsgUser.id" class="flex-1 p-20">
    <div v-for="(i, index) in currentMsgList" :key="index" class="my-10">
      <div :class="`flex ${i.sender.id === currentUser.id ? 'flex-row-reverse' : ''}`">
        {{ i.sender.username }}({{ i.sentAt }}):
      </div>
      <div :class="`flex ${i.sender.id === currentUser.id ? 'flex-row-reverse' : ''}`">
        {{ i.content }}
      </div>
    </div>
  </div>
  <div v-if="currentMsgUser.id" class="h-60 px-20 flex items-center">
    <n-input v-model:value="msg" round placeholder="发送信息" @keyup.enter="send">
      <template #suffix>
        <n-icon :component="Send" />
      </template>
    </n-input>
  </div>
</template>

<style scoped>

</style>
