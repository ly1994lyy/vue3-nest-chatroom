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
    store.setUser({ username, id })
    router.push({ name: 'chatroom', state: { username, id } })
  }
  catch (error) {
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1>在线聊天室</h1>
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
