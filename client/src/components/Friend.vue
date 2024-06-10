<script setup lang="ts">
import type { User } from '@/types/users'

interface IProp {
  friends: User[]
  currentMsgUser: {
    username: string
    id: bigint
    avatar: string
  }
}

defineProps<IProp>()

const emits = defineEmits(['setCurrentMsgUser'])
</script>

<template>
  <div
    v-for="user in friends" :key="`${user.id}`"
    :class="`flex cursor-pointer mb-10 p-20 h-50 items-center hover:bg-gray-100 ${user.id === currentMsgUser.id ? 'bg-coolgray-200' : ''}`"
    @click="emits('setCurrentMsgUser', user)"
  >
    <n-avatar
      round
      size="small"
      :src="user.avatar"
    />
    <div class="ml-10">
      {{ user.username }}
    </div>
    <div>
      <n-badge :value="20" />
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
