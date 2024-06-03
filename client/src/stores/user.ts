import { defineStore } from 'pinia'

interface User {
  username: string
  id: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      user: {
        username: '',
        id: '',
        avatar: '',
      },
    }
  },
  actions: {
    setUser(user: User) {
      this.user = user
    },
  },
})
