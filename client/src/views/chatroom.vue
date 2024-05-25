<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import { onMounted, ref } from 'vue'
import type { IMsg } from '@/types/model'

interface IProp {
  currentMsgUser: {
    username: string
    id: string
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

const currentUser = ref({
  username: '',
  id: '',
})

function send() {
  props.socket.emit('sendMsg', {
    fromUsername: currentUser.value.username,
    fromUserId: currentUser.value.id,
    toUserId: props.currentMsgUser.id,
    sendTime: new Date().getTime(),
    msg: msg.value,
  })
  emits('localSendMsg', {
    formUsername: 'you',
    toUserId: props.currentMsgUser.id,
    sendTime: new Date().getTime(),
    msg: msg.value,
  })
  msg.value = ''
}

onMounted(() => {
  currentUser.value = {
    username: history.state.username as string,
    id: history.state.id as string,
  }
})
</script>

<template>
  <div v-if="currentMsgUser.id">
    <n-card :title="`当前正和${currentMsgUser.username}聊天`">
      <div v-for="(i, index) in currentMsgList" :key="index">
        <div>{{ i.formUsername }}({{ i.sendTime }}):</div>
        <div>{{ i.msg }}</div>
      </div>
    </n-card>
    <n-input
      v-model:value="msg"
      type="textarea"
      placeholder="输入聊天内容"
    />
    <n-button type="primary" @click="send">
      发送
    </n-button>
  </div>
</template>

<style scoped>

</style>
