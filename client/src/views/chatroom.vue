<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import { onMounted, ref } from 'vue'
import { Send } from '@vicons/ionicons5'
import type { IMsg } from '@/types/model'
import { formateDataTime } from '@/utils/data'
import type { User } from '@/types/users'

interface IProp {
  currentMsgUser: {
    username: string
    id: string
    avatar: string
  }
  socket: Socket
  currentMsgList: IMsg[]
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
    fromUsername: currentUser.value.username,
    fromUserId: currentUser.value.id,
    toUserId: props.currentMsgUser.id,
    sendTime: formateDataTime(new Date().getTime()),
    msg: msg.value,
  })
  emits('localSendMsg', {
    formUsername: currentUser.value.username,
    toUserId: props.currentMsgUser.id,
    sendTime: formateDataTime(new Date().getTime()),
    msg: msg.value,
  })
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
      <div :class="`flex ${i.formUsername === currentUser.username ? 'flex-row-reverse' : ''}`">
        {{ i.formUsername }}({{ i.sendTime }}):
      </div>
      <div :class="`flex ${i.formUsername === currentUser.username ? 'flex-row-reverse' : ''}`">
        {{ i.msg }}
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
