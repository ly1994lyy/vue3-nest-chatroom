<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useSocket } from '@/hooks/useSocket.ts'

interface IProps {
  modelValue: boolean
}
const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const groups = ref(null)
const { socket } = useSocket()

function createGroup() {
  socket.emit('createGroup', groups.value)
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
      <n-checkbox-group v-model:value="groups">
        <n-space item-style="display: flex;">
          <n-checkbox v-for="user in userStore.friends" :key="user.id" :value="user.id" :label="user.username" />
        </n-space>
      </n-checkbox-group>
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
