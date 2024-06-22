<script setup lang="ts">
import { useSocket } from '@/hooks/useSocket'
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'
import type { Group } from '@/types/group'
import type { User } from '@/types/users'
import { isGroup } from '@/utils/util'

const userStore = useUserStore()
const messageStore = useMessageStore()
const { socket } = useSocket()

interface IParam {
  userId: bigint
  friendId?: bigint
  groupId?: bigint
}

function clickFriend(user: User | Group) {
  userStore.setCurrentMsgUser(user)
  if (messageStore.msgList.find(msg => isGroup(user) ? (msg.group?.gId === (user as Group).gId) : (msg.user?.id === (user as User).id))?.unReadMessages.length) {
    const param: IParam = {
      userId: userStore.currentUser.id,
    }
    if (isGroup(user))
      param.groupId = (user as Group).gId
    else
      param.friendId = (user as User).id
    socket.emit('readMessage', param)
    messageStore.readMessage()
  }
}
</script>

<template>
  <div
    v-for="user in userStore.friends"
    :key="`${isGroup(user) ? (user as Group).gId : (user as User).id}`"
    :class="`flex
    cursor-pointer
    mb-10 p-20 h-50
    items-center justify-between hover:bg-gray-100
    ${(!isGroup(user)
    ? (user as User).id === (userStore.currentMsgUser as User).id
    : (user as Group).gId === (userStore.currentMsgUser as Group).gId)
    ? 'bg-coolgray-200' : ''}`"
    @click="clickFriend(user)"
  >
    <div class="flex items-center">
      <n-avatar
        round
        size="small"
        :src="!isGroup(user) ? (user as User).avatar : '/group.jpg'"
      />
      <div class="ml-10">
        {{ !isGroup(user) ? (user as User).username : (user as Group).name }}
      </div>
    </div>
    <div>
      <n-badge
        :value="messageStore.msgList.find(msg => isGroup(user) ? ((user as Group).gId === msg.group?.gId) : (msg.user?.id === (user as User).id))?.unReadMessages.length"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
