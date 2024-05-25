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
  <div>
    <div v-for="user in onlineUser" :key="user.id" class="online-user" @click="emits('setCurrentMsgUser', user)">
      <div>
        {{ user.username }}(id:{{ user.id }})
      </div>
      <div class="socket-id">
        {{ user.socketId }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.online-user{
  border-bottom: 1px solid #534f4f;
  margin: 10px 0;
  .socket-id{
    font-size: 12px;
    color: #999;
  }
}
</style>
