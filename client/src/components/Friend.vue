<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const messageStore = useMessageStore()
</script>

<template>
  <div
    v-for="user in userStore.friends" :key="`${user.id}`"
    :class="`flex cursor-pointer mb-10 p-20 h-50 items-center justify-between hover:bg-gray-100 ${user.id === userStore.currentMsgUser.id ? 'bg-coolgray-200' : ''}`"
    @click="userStore.setCurrentMsgUser(user)"
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
