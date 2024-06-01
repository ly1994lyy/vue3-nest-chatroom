<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { Search, Settings } from '@vicons/ionicons5'
import Friend from '@/components/Friend.vue'
import type { IMsg, IMsgBox, IServerMSg, onlineUser } from '@/types/model'

const socket = io('http://localhost:9000')
const message = useMessage()
const router = useRouter()

socket.on('connect', () => {
  message.success('连接成功')
})
// 当前登录的用户
const currentUser = ref({
  username: '',
  id: '',
})
// 当前聊天窗口的对象用户
const currentMsgUser = ref({
  username: '',
  id: '',
})
// 所有在线用户的集合
const onlineUserList = ref<onlineUser[]>([])
// 和当前登录用户的所有聊天记录集合
const msgList = ref<IMsgBox[]>([] as IMsgBox[])

socket.on('onlineUserList', (data: onlineUser[]) => {
  onlineUserList.value = data.filter(i => i.id !== currentUser.value.id)
})

function setCurrentMsgUser(user: { username: string, id: string }) {
  currentMsgUser.value = user
}

function localSendMsg(msg: IMsg) {
  const user = msgList.value.find(e => e.userId === currentMsgUser.value.id)
  if (user) {
    user.msgList.push(msg)
  }
  else {
    msgList.value.push({
      userId: currentMsgUser.value.id,
      msgList: [msg],
    })
  }
}

function serverSendMsg(message: IServerMSg) {
  const user = msgList.value.find(e => e.userId === message.sendUserId)
  if (user) {
    user.msgList.push({
      formUsername: message.sendUserName,
      msg: message.msg,
      sendTime: message.sendTime,
    })
  }
  else {
    msgList.value.push({
      userId: message.sendUserId,
      msgList: [{
        formUsername: message.sendUserName,
        msg: message.msg,
        sendTime: message.sendTime,
      }],
    })
  }
}

const currentMsgList = computed(() => msgList.value.find(e => e.userId === currentMsgUser.value.id)?.msgList || [])

function logout() {
  socket.emit('offline', currentUser.value.id)
  router.push('/login')
}

onMounted(() => {
  currentUser.value = {
    username: history.state.username as string,
    id: history.state.id as string,
  }
  socket.emit('online', currentUser.value, (data: { data: onlineUser[] }) => {
    onlineUserList.value = data.data.filter(i => i.id !== currentUser.value.id)
    onlineUserList.value.forEach((e) => {
      msgList.value.push({
        userId: e.id,
        msgList: [],
      })
    })
  })
})
</script>

<template>
  <div class="fullscreen flex">
    <div class="h-full w-300 flex flex-col b-r-solid b-r-1 border-r-coolGray">
      <div class="h-60 flex items-center px-20">
        <n-input>
          <template #suffix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
      <div class="flex-1">
        <div>
          <Friend :online-user="onlineUserList" :current-msg-user="currentMsgUser" @set-current-msg-user="setCurrentMsgUser" />
        </div>
      </div>
      <div class="h-60 flex items-center justify-between p-20 bg-light">
        <div>
          <n-avatar
            round
            size="small"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
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
      <RouterView :current-msg-user="currentMsgUser" :socket="socket" :current-msg-list="currentMsgList" @local-send-msg="localSendMsg" @server-send-msg="serverSendMsg" />
    </div>
  </div>
</template>

<style scoped></style>
