<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useSocket } from '@/hooks/useSocket.ts'

interface IProps {
  modelValue: boolean
}
const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const { socket } = useSocket()

const form = ref({
  name: '',
  members: [],
})

function createGroup() {
  socket.emit('createGroup', { ...form.value, createBy: userStore.currentUser.id })
  emits('update:modelValue', false)
}
</script>

<template>
  <n-modal :show="props.modelValue">
    <n-card
      style="width: 600px"
      title="建立群聊"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form :model="form">
        <n-form-item path="name" label="群组名称">
          <n-input v-model:value="form.name" />
        </n-form-item>
        <n-form-item path="members" label="成员">
          <n-checkbox-group v-model:value="form.members">
            <n-space item-style="display: flex;">
              <n-checkbox v-for="user in userStore.friends" :key="user.id" :value="user.id" :label="user.username" />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex flex-row-reverse">
          <n-button @click="emits('update:modelValue', false)">
            取消
          </n-button>
          <n-button type="primary" class="mr-10" @click="createGroup">
            确认
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
