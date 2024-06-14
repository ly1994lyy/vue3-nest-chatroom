<script setup lang="ts">
import { useSocket } from '@/hooks/useSocket'
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/users'

const userStore = useUserStore()
const messageStore = useMessageStore()
const { socket } = useSocket()

function clickFriend(user: User) {
  userStore.setCurrentMsgUser(user)
  if (messageStore.msgList.find(msg => msg.user.id === user.id)?.unReadMessages.length) {
    socket.emit('readMessage', { userId: userStore.currentUser.id, friendId: user.id })
    messageStore.readMessage()
  }
}
</script>

<template>
  <div
    v-for="user in userStore.friends" :key="`${user.id}`"
    :class="`flex cursor-pointer mb-10 p-20 h-50 items-center justify-between hover:bg-gray-100 ${user.id === userStore.currentMsgUser.id ? 'bg-coolgray-200' : ''}`"
    @click="clickFriend(user)"
  >
    <div class="flex items-center">
      <n-avatar
        round
        size="small"
        :src="user.avatar"
      />
      <div class="ml-10">
        {{ user.username }}
      </div>
    </div>
    <div>
      <n-badge :value="messageStore.msgList.find(msg => msg.user.id === user.id)?.unReadMessages.length" />
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
