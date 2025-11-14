<template>
  <div
    class="message-item"
    :class="{ 'message-item--my': isMyMessage }"
  >
    <p
      v-if="!isMyMessage"
      class="message__author"
    >
      {{ message.userInfo.name }}:
    </p>
    <p
      class="message__text"
      :class="{ 'message__text--error': isFailed }"
    >
      {{ message.text }}
    </p>
    <div
      v-if="!message.status"
      class="message__error"
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
        <path
          d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
        />
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
  'on-error-click': [message: MessageType]
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useChatStore();

const isMyMessage = computed<boolean>(() => {
  return props.message.userInfo.id === store.userInfo.id;
});

const isFailed = computed<boolean>(() => {
  return !props.message.status;
});

const onErrorClick = (): void => {
  emit('on-error-click', props.message);
};
</script>

<style scoped>
.message-item {
  padding: 1rem;
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-shadow: 1px 1px 2px rgb(214, 214, 214);
  position: relative;
}

.message-item--my {
  align-self: flex-end;
  margin-left: 3rem;
  justify-content: flex-end;
}

.message__author {
  margin: 0 0.5rem;
  font-weight: 600;
  color: white;
}

.message__text {
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
  margin: 0;
}

.message__text--error {
  border: 1px solid red;
}

.message__error {
  position: absolute;
  top: 50%;
  left: -0.5rem;
  transform: translate(0, -50%);
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.message__error-icon {
  display: block;
}

@media (max-width: 640px) {
  .message__text {
    padding: 0.5rem 1rem;
  }
}
</style>