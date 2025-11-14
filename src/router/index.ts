import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Chat from '@/components/Chat.vue';
import YourNameComponent from '@/components/YourNameComponent.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/chat' },
  { path: '/chat', name: 'Chat', component: Chat },
  { path: '/name', name: 'Name', component: YourNameComponent },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
