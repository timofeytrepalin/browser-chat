import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';
import '@/assets/css/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

import { useChatStore } from '@/store/chatStore';
import type { RouteLocationNormalized } from 'vue-router';

router.beforeEach((to: RouteLocationNormalized) => {
	const store = useChatStore();
	const hasUser = !!store.userInfo.id;
	if (to.path === '/chat' && !hasUser) {
		return { path: '/name' };
	}
	if (to.path === '/name' && hasUser) {
		return { path: '/chat' };
	}
	return true;
});

app.mount('#app');
