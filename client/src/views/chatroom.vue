<script setup lang="ts">
import { Send } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import type { IMessage } from '@/types/message'
import { useMessageStore } from '@/stores/message'
import { useSocket } from '@/hooks/useSocket'
import { formateDataTime } from '@/utils/data'
import { isGroup } from '@/utils/util'
import type { User } from '@/types/users'
import type { Group } from '@/types/group'

const { socket } = useSocket()

const userStore = useUserStore()
const messageStore = useMessageStore()

const msg = ref('')
socket.on('receiveMsg', (data) => {
  messageStore.receiveMessage(data)
})

function send() {
  if (!isGroup(userStore.currentMsgUser)) {
    socket.emit('sendMsg', {
      sender: userStore.currentUser,
      receiver: userStore.currentMsgUser,
      content: msg.value,
      sentAt: new Date(),
    } as IMessage, (data: IMessage) => {
      messageStore.receiveMessage(data)
    })
  }
  else {
    socket.emit('sendGroupMsg', {
      sender: userStore.currentUser,
      group: userStore.currentMsgUser,
      content: msg.value,
      sentAt: new Date(),
    })
  }
  msg.value = ''
}

const isShow = computed(() => (userStore.currentMsgUser as Group).gId || (userStore.currentMsgUser as User).id)
</script>

<template>
  <div v-if="isShow" class="h-60 b-b-solid b-b-2 border-b-coolGray flex items-center px-20 justify-between">
    <div class="flex items-center">
      <n-avatar
        round
        size="small"
        :src="!isGroup(userStore.currentMsgUser) ? (userStore.currentMsgUser as User).avatar : '/group.jpg'"
      />
      <div class="ml-10">
        {{ !isGroup(userStore.currentMsgUser) ? (userStore.currentMsgUser as User).username : (userStore.currentMsgUser as Group).name }}
      </div>
    </div>
    <div>
      <DeleteFriend />
    </div>
  </div>
  <div v-if="isShow" class="flex-1 p-20 overflow-auto flex">
    <div class="flex-1" :class="isGroup(userStore.currentMsgUser) ? 'pr-20' : ''">
      <div v-for="(i, index) in messageStore.currentMsgList" :key="index" class="my-10">
        <div :class="`flex ${i.sender.id === userStore.currentUser.id ? 'flex-row-reverse' : ''}`">
          {{ i.sender.username }}({{ formateDataTime(i.sentAt.toString()) }}):
        </div>
        <div :class="`flex ${i.sender.id === userStore.currentUser.id ? 'flex-row-reverse' : ''}`">
          {{ i.content }}
        </div>
      </div>
    </div>
    <Member v-if="isGroup(userStore.currentMsgUser)" />
  </div>
  <div v-if="isShow" class="h-60 px-20 flex items-center">
    <n-input v-model:value="msg" round placeholder="发送信息" @keyup.enter="send">
      <template #suffix>
        <n-icon :component="Send" />
      </template>
    </n-input>
  </div>
</template>

<style scoped>

</style>
