<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import type { Group } from '@/types/group'

const userStore = useUserStore()
</script>

<template>
  <div class="flex flex-col w-150 bg-bluegray">
    <div class="text-center font-700 m-10">
      群成员
    </div>
    <div class="my-5 ml-10">
      <div class="flex items-center">
        <div>
          <n-avatar
            round
            size="small"
            :src="(userStore.currentMsgUser as Group).createdBy.avatar"
          />
        </div>
        <div class="ml-10">
          {{ (userStore.currentMsgUser as Group).createdBy.username }}
        </div>
        <div class="text-dark text-13 ml-2">
          (群主)
        </div>
        <div v-if="(userStore.currentMsgUser as Group).createdBy.id === userStore.currentUser.id" class="text-10 ml-5 text-white">
          我
        </div>
      </div>
    </div>
    <div v-for="e in (userStore.currentMsgUser as Group).members" :key="`${e.id}`" class="my-5 ml-10">
      <div class="flex items-center">
        <div>
          <n-avatar
            round
            size="small"
            :src="e.avatar"
          />
        </div>
        <div class="ml-10">
          {{ e.username }}
        </div>
        <div v-if="e.id === userStore.currentUser.id" class="text-10 ml-5 text-white">
          我
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
