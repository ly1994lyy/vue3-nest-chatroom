<script setup lang="ts">
import { useSocket } from '@/hooks/useSocket'
import { useUserStore } from '@/stores/user'

const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])

const { socket } = useSocket()
const userStore = useUserStore()

interface IProps {
  modelValue: boolean
}

function handleAddReq(id: bigint, result: boolean) {
  socket.emit('addFriend', { userId: id, friendId: userStore.currentUser.id, result })
  userStore.handleAddFriendReq(id)
  emits('update:modelValue', false)
}
</script>

<template>
  <n-modal :show="props.modelValue">
    <n-card
      style="width: 600px"
      title="好友请求"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div v-for="user in userStore.addFriendReqList" :key="`${user.id}`" class="flex items-center my-10">
        <div>
          {{ user.username }}请求添加好友
        </div>
        <div class="ml-10">
          <n-button type="primary" size="small" @click="handleAddReq(user.id, true)">
            同意
          </n-button>
          <n-button class="ml-10" type="primary" size="small" @click="handleAddReq(user.id, false)">
            拒绝
          </n-button>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-row-reverse">
          <n-button @click="emits('update:modelValue', false)">
            取消
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
