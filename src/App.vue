<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useChatStore } from '@/store/chatStore';

const store = useChatStore();

const saveState = (): void => {
  store.saveState();
};

onMounted((): void => {
  store.loadState();
  window.addEventListener('beforeunload', saveState);
});

onUnmounted((): void => {
  window.removeEventListener('beforeunload', saveState);
});
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 1rem 0;
}
</style>
