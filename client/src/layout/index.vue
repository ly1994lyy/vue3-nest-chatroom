<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { Add, Search, Settings } from '@vicons/ionicons5'
import type { IUserInfo, User } from '@/types/users'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'
import { useSocket } from '@/hooks/useSocket'
import type { Group } from '@/types/group'
import { isGroup } from '@/utils/util'

const { socket } = useSocket()
const message = useMessage()
const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()

const options = [
  {
    label: '添加好友',
    key: 'addFriend',
  },
  {
    label: '建立群聊',
    key: 'createGroup',
  },
]

const visible = ref(false)
const createGroupVisible = ref(false)

function openAddFriendDialog() {
  visible.value = true
}

function openCreateGroupDialog() {
  createGroupVisible.value = true
}

function handleSelect(val: string) {
  if (val === 'addFriend')
    openAddFriendDialog()
  else
    openCreateGroupDialog()
}

const addvisible = ref(false)

function openAddFriend() {
  addvisible.value = true
}

socket.on('addFriendResponse', (data: { user: User }) => {
  userStore.pushAddFriendReq(data.user)
})

socket.on('addFriendResult', (data: { result: boolean, user: User }) => {
  if (!data.result)
    message.error(`${data.user.username}拒绝了您的好友申请！`)
  else
    message.success(`${data.user.username}同意了您的好友申请！`)
})

function handleUserInfo(info: IUserInfo) {
  const friends = [...info.friends?.filter(i => i.id !== userStore.currentUser.id), ...info.groups]
  userStore.setFriends(friends)
  userStore.friends.forEach((e: User | Group) => {
    if (!isGroup(e)) {
      const msg = info.messages.filter(item => (item.receiver?.id === e.id || item.sender.id === e.id) && !item.group)
      const unreadMsg = info.offlineMessage.filter(item => item.sender.id === e.id)
      messageStore.addNewMsgList({ user: e as User, messages: msg, unReadMessages: unreadMsg })
    }
    else {
      const msg = info.messages.filter(item => item.group && (item.group.id === e.id))
      const unreadMsg = info.offlineMessage.filter(item => item.group?.id === e.id)
      messageStore.addNewMsgList({ group: e as Group, messages: msg, unReadMessages: unreadMsg })
    }
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
      console.log(data)
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
      <div class="h-60 flex items-center justify-between px-20">
        <div class="w-220">
          <n-input>
            <template #suffix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </div>
        <div>
          <n-dropdown trigger="hover" :options="options" @select="handleSelect">
            <n-button circle>
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </div>
      </div>
      <div class="flex-1">
        <div v-if="userStore.addFriendReqList.length" class="p-20" @click="openAddFriend">
          <n-button class="w-full" type="error">
            有{{ userStore.addFriendReqList.length }}个好友请求
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

    <SureAddFriend v-if="addvisible" v-model="addvisible" />
    <CreateGroup v-if="createGroupVisible" v-model="createGroupVisible" />
    <AddFriend v-if="visible" v-model="visible" :socket="socket" />
  </div>
</template>

<style scoped></style>
