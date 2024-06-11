<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { Add, Search, Settings } from '@vicons/ionicons5'
import Friend from '@/components/Friend.vue'
import AddFriend from '@/components/AddFriend.vue'
import type { IMessage } from '@/types/message'
import type { User } from '@/types/users'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'

const socket = io('http://localhost:9000')
const message = useMessage()
const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()

const visible = ref(false)
function getUserVisible() {
  visible.value = true
}

const addFriendReqList = ref<User[]>([])
const addvisible = ref(false)

function openAddFriend() {
  addvisible.value = true
}

socket.on('addFriendResponse', (data: { user: User }) => {
  addFriendReqList.value.push(data.user)
})

function addFriendSure(id: bigint) {
  socket.emit('addFriend', { userId: id, friendId: userStore.currentUser.id })
  addvisible.value = false
  message.success('添加好友成功')
}

function logout() {
  socket.emit('offline', userStore.currentUser.id)
  localStorage.removeItem('user')
  router.push('/login')
}

socket.on('disconnect', () => {
  message.error('断开了连接')
})

onMounted(() => {
  socket.on('connect', () => {
    message.success('连接成功')
  })
  socket.emit('online', userStore.currentUser, (data: { friends: User[], message: IMessage[], offlineMessage: IMessage[] }) => {
    userStore.setFriends(data.friends.filter(i => i.id !== userStore.currentUser.id))
    userStore.friends.forEach((e) => {
      const msg = data.message.filter(item => item.receiver.id === e.id || item.sender.id === e.id)
      const unreadMsg = data.offlineMessage.filter(item => item.receiver.id === e.id)
      messageStore.addNewMsgList({ user: e, messages: msg, unReadMessages: unreadMsg })
    })
  })
})
</script>

<template>
  <div class="fullscreen flex">
    <div class="h-full w-300 flex flex-col b-r-solid b-r-1 border-r-coolGray">
      <div class="h-60 flex items-center  px-20">
        <n-input class="w-60">
          <template #suffix>
            <n-icon :component="Search" />
          </template>
        </n-input>
        <n-button circle @click="getUserVisible">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
        </n-button>
      </div>
      <div class="flex-1">
        <div v-if="addFriendReqList.length" class="p-20" @click="openAddFriend">
          <n-button class="w-full" type="error">
            有{{ addFriendReqList.length }}个好友请求
          </n-button>
        </div>

        <div>
          <Friend />
        </div>
      </div>
      <div class="h-60 flex items-center justify-between p-20 bg-light">
        <div>
          <n-avatar
            round
            size="small"
            :src="userStore.currentUser.avatar"
          />
        </div>
        <n-button circle @click="logout">
          <template #icon>
            <n-icon :component="Settings" />
          </template>
        </n-button>
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <RouterView :socket="socket" />
    </div>

    <n-modal v-model:show="addvisible">
      <n-card
        style="width: 600px"
        title="添加好友"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div v-for="user in addFriendReqList" :key="`${user.id}`">
          {{ user.username }}请求添加好友<n-button type="primary" @click="addFriendSure(user.id)">
            确认
          </n-button>
        </div>
      </n-card>
    </n-modal>

    <AddFriend v-if="visible" v-model="visible" :socket="socket" />
  </div>
</template>

<style scoped></style>
