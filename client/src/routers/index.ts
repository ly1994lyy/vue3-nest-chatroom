import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/chatroom',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/chatroom',
        name: 'chatroom',
        component: () => import('@/views/chatroom.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
]

const routers = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default routers
