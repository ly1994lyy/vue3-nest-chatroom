<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import type { Group } from '@/types/group'

const userStore = useUserStore()
</script>

<template>
  <div class="flex flex-col w-md bg-bluegray">
    <div class="text-center font-700 m-10">
      群成员
    </div>
    <div v-for="e in (userStore.currentMsgUser as Group).members" :key="`${e.id}`" class="my-5 ml-10">
      <div class="flex">
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
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
