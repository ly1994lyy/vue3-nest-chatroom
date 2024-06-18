<script setup lang="ts">
import { LockClosed, Person } from '@vicons/ionicons5'
import { loginApi } from '@/apis/login.ts'
import { useUserStore } from '@/stores/user.ts'

const userStore = useUserStore()
const router = useRouter()

const formValue = ref({
  username: '',
  password: '',
})

async function login() {
  try {
    const res = await loginApi(formValue.value)
    userStore.setCurrentUser(res.data.user)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push({ name: 'chatroom' })
  }
  catch (error) {
  }
}
</script>

<template>
  <div class="f-center items-center w-screen h-screen bg-gray-100 bg-no-repeat bg-cover" style="background-image: url('/background.jpg');">
    <div class="w-400 h-400 md:h-500 bg-white rounded-20 f-center flex-col shadow-2xl opacity-70">
      <h1
        p="y-20" text="35 black" font="bold"
      >
        Vue Chat
      </h1>
      <n-form :model="formValue">
        <n-form-item path="user.name">
          <n-input v-model:value="formValue.username" placeholder="输入姓名">
            <template #prefix>
              <n-icon :component="Person" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="user.age">
          <n-input
            v-model:value="formValue.password"
            type="password"
            placeholder="输入密码"
          >
            <template #prefix>
              <n-icon :component="LockClosed" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" class="w-full" type="primary" @click="login">
            登录
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
</style>
