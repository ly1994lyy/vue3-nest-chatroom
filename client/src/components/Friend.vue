<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div
    v-for="user in userStore.friends" :key="`${user.id}`"
    :class="`flex cursor-pointer mb-10 p-20 h-50 items-center hover:bg-gray-100 ${user.id === userStore.currentMsgUser.id ? 'bg-coolgray-200' : ''}`"
    @click="userStore.setCurrentMsgUser(user)"
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
