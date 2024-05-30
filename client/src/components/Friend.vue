<script setup lang="ts">
import type { onlineUser } from '@/types/model'

interface IProp {
  onlineUser: onlineUser[]
  currentMsgUser: {
    username: string
    id: string
  }
}

defineProps<IProp>()

const emits = defineEmits(['setCurrentMsgUser'])
</script>

<template>
  <div v-for="user in onlineUser" :key="user.id" class="flex cursor-pointer mb-10 h-40 items-center hover:bg-gray-100 " @click="emits('setCurrentMsgUser', user)">
    <n-avatar
      round
      size="small"
      src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
    <div class="ml-10">
      {{ user.username }}
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
