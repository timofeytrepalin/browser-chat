<template>
  <div class="chat-screen">
    <div class="chat-screen__messages">
      <Message
        v-for="message in store.reversedMessages"
        :key="message.id"
        :message="message"
        @on-error-click="onErrorClick"
      />
    </div>

    <div class="chat__panel">
      <div class="chat__input-panel">
        <CustomInput
          ref="inputRef"
          v-model="messageText"
          class="chat__input"
          @enter="onEnter"
        />
        <CustomButton
          class="chat__button chat__button--send"
          @click="onClickSend"
        >
          <span>Отправить</span>
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import CustomInput from '@/components/ui/CustomInput.vue';
import CustomButton from '@/components/ui/CustomButton.vue';
import Message from './Message.vue';
import { useChatStore } from '@/store/chatStore';

const store = useChatStore();
const messageText = ref<string>('');
const inputRef = ref<InstanceType<typeof CustomInput> | null>(null);

const onGetNewMessage = (): void => {
  const msgData = localStorage.getItem('message');
  if (!msgData) return;
  try {
    const parsed = JSON.parse(msgData);
    store.addExternalMessage(parsed);
  } catch (e) {
    console.error('Failed to parse message from storage event:', e);
  }
};

const onErrorClick = async (message: { id: number; text: string }): Promise<void> => {
  store.deleteMessage(message.id);
  await store.sendMessage(message.text);
};

const onClickSend = async (): Promise<void> => {
  if (!messageText.value.trim()) return;
  await store.sendMessage(messageText.value);
  messageText.value = '';
  setTimeout(() => inputRef.value?.$el?.focus(), 0);
};

const onEnter = async (): Promise<void> => {
  await onClickSend();
};

onMounted((): void => {
  window.addEventListener('storage', onGetNewMessage);
  setTimeout(() => inputRef.value?.$el?.focus(), 0);
});

onUnmounted((): void => {
  window.removeEventListener('storage', onGetNewMessage);
});
</script>

<style scoped>
.chat-screen {
  width: 640px;
  height: 700px;
  margin: 0 auto;
  box-shadow: 0 20px 15px -5px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-screen__messages {
  flex: 1;
  height: 85%;
  background-color: rgb(59, 59, 59);
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
}

.chat-screen__panel {
  height: 15%;
  position: relative;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.chat-screen__input-panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 1rem;
}

.chat-screen__input {
  border: 1px solid rgba(0, 95, 95, 0.356);
  border-radius: 5px;
  width: 400px;
}

.chat-screen__button {
  transition: all 0.2s ease;
}

.chat-screen__button--send {
  background-color: #00dc81;
  color: white;
}

.chat-screen__button--send:hover {
  background-color: #00dc808a;
}

@media (max-width: 640px) {
  .chat-screen {
    width: 100%;
  }

  .chat-screen__input {
    width: auto;
  }
}
</style>