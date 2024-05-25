import { defineStore } from 'pinia'

interface User {
  username: string
  id: string
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      user: {
        username: '',
        id: ''
      }
    }
  },
  actions: {
    setUser(user: User) {
      this.user = user
    }
  }
})
