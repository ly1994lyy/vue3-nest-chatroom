<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { Add, Search, Settings } from '@vicons/ionicons5'
import Friend from '@/components/Friend.vue'
import AddFriend from '@/components/AddFriend.vue'
import SureAddFriend from '@/components/SureAddFriend.vue'
import type { IUserInfo, User } from '@/types/users'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'
import { useSocket } from '@/hooks/useSocket'

const { socket } = useSocket()
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

socket.on('addFriendResult', (data: { result: boolean, user: User }) => {
  if (!data.result)
    message.error(`${data.user.username}拒绝了您的好友申请！`)
  else
    message.success(`${data.user.username}同意了您的好友申请！`)
})

function handleUserInfo(info: IUserInfo) {
  userStore.setFriends(info.friends?.filter(i => i.id !== userStore.currentUser.id))
  userStore.friends.forEach((e) => {
    const msg = info.messages.filter(item => item.receiver.id === e.id || item.sender.id === e.id)
    const unreadMsg = info.offlineMessage.filter(item => item.sender.id === e.id)
    messageStore.addNewMsgList({ user: e, messages: msg, unReadMessages: unreadMsg })
  })
}

socket.on('getUserInfo', (data: IUserInfo) => {
  handleUserInfo(data)
})

function logout() {
  socket.emit('offline', userStore.currentUser.id)
  localStorage.removeItem('user')
  router.push('/login')
}

socket.on('disconnect', () => {
  message.error('断开了连接')
})

onMounted(() => {
  if (localStorage.getItem('user')) {
    userStore.setCurrentUser(JSON.parse(localStorage.getItem('user')!))
    socket.on('connect', () => {
      message.success('连接成功')
    })
    socket.emit('online', userStore.currentUser, (data: IUserInfo) => {
      handleUserInfo(data)
    })
  }
  else {
    router.push('/login')
  }
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
      <RouterView />
    </div>

    <SureAddFriend v-if="addvisible" v-model="addvisible" :add-friend-req-list="addFriendReqList" />
    <AddFriend v-if="visible" v-model="visible" :socket="socket" />
  </div>
</template>

<style scoped></style>
