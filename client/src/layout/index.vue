<script setup lang="ts">

</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 24px;">
        海淀桥
      </n-layout-sider>
      <n-layout>
        <n-layout-header>颐和园路</n-layout-header>
        <n-layout-content content-style="padding: 24px;">
          <RouterView />
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
