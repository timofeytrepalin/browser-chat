<template>
  <div class="chat-stats">
    <div class="chat-stats__item">
      <span class="chat-stats__label">Total:</span>
      <span class="chat-stats__value">{{ stats.total }}</span>
    </div>
    <div class="chat-stats__item">
      <span class="chat-stats__label">Sent:</span>
      <span class="chat-stats__value chat-stats__value--sent">{{ stats.sent }}</span>
    </div>
    <div class="chat-stats__item">
      <span class="chat-stats__label">Failed:</span>
      <span class="chat-stats__value chat-stats__value--failed">{{ stats.failed }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/store/chatStore';

const store = useChatStore();
const { stats } = store;
</script>

<style scoped>
.chat-stats {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 0;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.chat-stats__item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chat-stats__label {
  font-weight: 600;
  color: #999;
}

.chat-stats__value {
  font-weight: bold;
  color: #233759;
}

.chat-stats__value--sent {
  color: #00dc81;
}

.chat-stats__value--failed {
  color: #ff4444;
}
</style>
