<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
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
  if (user)
    user.msgList.push(msg)
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
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 24px;">
        <Friend :online-user="onlineUserList" :current-msg-user="currentMsgUser" @set-current-msg-user="setCurrentMsgUser" />
      </n-layout-sider>
      <n-layout>
        <n-layout-header>
          当前用户:{{ currentUser.username }},id为{{ currentUser.id }}
          <n-button type="success" @click="logout">
            退出当前聊天室
          </n-button>
        </n-layout-header>
        <n-layout-content content-style="padding: 24px;">
          <RouterView :current-msg-user="currentMsgUser" :socket="socket" :current-msg-list="currentMsgList" @local-send-msg="localSendMsg" @server-send-msg="serverSendMsg" />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style scoped>
.n-layout-header{
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
  height: 100vh;
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
  height: calc(100vh - 70px);
}
</style>
