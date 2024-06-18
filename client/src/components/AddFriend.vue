<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import type { User } from '@/types/users'
import { useUserStore } from '@/stores/user'

interface IProps {
  modelValue: boolean
  socket: Socket
}
const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const userResult = ref<User>({} as User)
const queryUser = ref({
  name: '',
})
function searchUser() {
  props.socket.emit('searchUser', queryUser.value.name, (data: { data: User }) => {
    userResult.value = data.data
  })
}

function addFriend() {
  props.socket.emit('addFriendRequest', { userId: userStore.currentUser.id, friendId: userResult.value.id })
}
</script>

<template>
  <n-modal :show="props.modelValue">
    <n-card
      style="width: 600px"
      title="查找用户"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex">
        <div class="w-3/4">
          <n-input v-model:value="queryUser.name" />
        </div>
        <n-button class="ml-10" @click="searchUser">
          查找
        </n-button>
      </div>
      <div v-if="userResult.id" class="w-1/3 b-1 b-solid b-coolGray-4 p-10 rounded-2xl mt-10 shadow-2xl">
        <div class="flex items-center">
          <div>
            <n-avatar
              round
              size="small"
              :src="userResult.avatar"
            />
          </div>
          <div class="ml-10">
            {{ userResult.username }}
          </div>
        </div>
        <div class="flex flex-row-reverse">
          <n-button size="small" type="primary" @click="addFriend">
            添加好友
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
