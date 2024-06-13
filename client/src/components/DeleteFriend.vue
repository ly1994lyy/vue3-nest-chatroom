<script setup lang="ts">
import { useDialog, useMessage } from 'naive-ui'
import { TrashOutline } from '@vicons/ionicons5'
import type { User } from '@/types/users'
import { useSocket } from '@/hooks/useSocket'
import { useUserStore } from '@/stores/user'

const { socket } = useSocket()

const userStore = useUserStore()
const dialog = useDialog()
const message = useMessage()

function delFriend() {
  dialog.warning({
    title: '警告',
    content: '你确定要删除该好友？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      socket.emit('deleteFriend', { userId: userStore.currentUser.id, friendId: userStore.currentMsgUser.id })
      userStore.setCurrentMsgUser({} as User)
      message.error('删除成功')
    },
    onNegativeClick: () => {},
  })
}
</script>

<template>
  <n-icon size="20" :component="TrashOutline" class="cursor-pointer" @click="delFriend" />
</template>

<style scoped>

</style>
