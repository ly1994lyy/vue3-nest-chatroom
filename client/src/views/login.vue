<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { loginApi } from '@/apis/login.ts'
import { useUserStore } from '@/stores/user.ts'

const router = useRouter()
const store = useUserStore()

const formValue = ref({
  username: '',
  password: '',
})

async function login() {
  try {
    const res = await loginApi(formValue.value)
    const username = res.data.user.username
    const id = res.data.user.id
    const avatar = res.data.user.avatar
    store.setUser({ username, id, avatar })
    router.push({ name: 'chatroom', state: { username, id, avatar } })
  }
  catch (error) {
  }
}
</script>

<template>
  <div class="f-center items-center w-screen h-screen bg-gray-100">
    <div class="w-400 h-500 bg-white rounded-20 f-center flex-col">
      <h1
        p="y-20" text="40 amber" font="bold"
      >
        在线聊天室
      </h1>
      <n-form :label-width="80" :model="formValue">
        <n-form-item label="姓名" path="user.name">
          <n-input v-model:value="formValue.username" placeholder="输入姓名" />
        </n-form-item>
        <n-form-item label="密码" path="user.age">
          <n-input
            v-model:value="formValue.password"
            type="password"
            placeholder="输入密码"
          />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="login">
            登录
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  .login-box {
    width: 40vw;
    height: 60vh;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
