<template>
  <div
    class="message-item"
    :class="{ 'message-item--my': isMyMessage }"
  >
    <div
      v-if="!isMyMessage"
      class="message-item__avatar"
    >
      <span class="avatar__initial">{{ avatarInitial }}</span>
    </div>

    <div class="message-item__bubble">
      <div class="message-item__header">
        <span
          v-if="!isMyMessage"
          class="message__author"
        >
          {{ message.userInfo.name }}
        </span>
        <span class="message__time">{{ formattedTime }}</span>
      </div>
      <p
        class="message__text"
        :class="{ 'message__text--error': isFailed }"
      >
        {{ message.text }}
      </p>
    </div>

    <div
      v-if="!message.status"
      class="message__error"
      title="Retry send"
      @click="onErrorClick"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="white"
        class="message__error-icon"
        viewBox="0 0 16 16"
      >
        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
        <path
          fill-rule="evenodd"
          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '@/store/chatStore';
import type { Message as MessageType } from '@/models/Message';

interface Props {
  message: MessageType
}

interface Emits {
  'on-error-click': [{ id: number; text: string }]
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useChatStore();


const isMyMessage = computed<boolean>(() => props.message.userInfo.id === store.userInfo.id);

const isFailed = computed<boolean>(() => !props.message.status);

const formattedTime = computed<string>(() => {
  try {
    const d = props.message.timestamp instanceof Date ? props.message.timestamp : new Date(String(props.message.timestamp));
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
});

const avatarInitial = computed<string>(() => {
  return String(props.message.userInfo.name || 'A').trim().charAt(0).toUpperCase();
});

const onErrorClick = (): void => {
  emit('on-error-click', {
    id: props.message.id,
    text: props.message.text,
  });
};
</script>

<style scoped>
.message-item {
  padding: 0.75rem 1rem;
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 0.5rem;
  position: relative;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item--my {
  justify-content: flex-end;
}

.message__author {
  margin: 0;
  padding: 0 0.5rem;
  font-weight: 600;
  font-size: 12px;
  color: #ccc;
}

.message__text {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  border-radius: 12px;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  max-width: 70%;
  transition: all 0.2s ease;
}

.message-item__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar__initial {
  font-size: 14px;
}

.message-item__bubble {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.message-item__header {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.message__time {
  font-size: 11px;
  color: var(--color-muted);
}

.message-item--my .message__text {
  background: linear-gradient(135deg, #00dc81 0%, #00d975 100%);
  color: white;
  box-shadow: 0 2px 12px rgba(0, 220, 129, 0.3);
}

.message__text--error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 12px rgba(255, 107, 107, 0.4);
}

.message__error {
  position: absolute;
  top: 50%;
  right: -2rem;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  padding: 0.25rem;
}

.message-item--my .message__error {
  right: auto;
  left: -2rem;
}

.message__error:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.2);
}

.message__error-icon {
  display: block;
  filter: drop-shadow(0 0 2px rgba(255, 107, 107, 0.8));
}

@media (max-width: 640px) {
  .message-item {
    padding: 0.5rem 0.75rem;
  }

  .message__text {
    padding: 0.5rem 0.75rem;
    max-width: 85%;
  }

  .message__error {
    position: static;
    transform: none;
    margin-left: 0.25rem;
    padding: 0;
  }

  .message-item--my .message__error {
    left: auto;
  }
}
</style>