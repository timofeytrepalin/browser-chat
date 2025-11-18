<template>
  <div class="chat-screen">
    <header class="chat-screen__header">
      <div class="chat-screen__title">
        Browser Chat
      </div>
      <div class="chat-screen__meta">
        <ChatStats />
      </div>
    </header>

    <div
      ref="messagesRef"
      class="chat-screen__messages"
    >
      <Message
        v-for="message in store.reversedMessages"
        :key="message.id"
        :message="message as any"
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
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import CustomInput from '@/components/ui/CustomInput.vue';
import CustomButton from '@/components/ui/CustomButton.vue';
import Message from './Message.vue';
import ChatStats from './ChatStats.vue';
import { useChatStore } from '@/store/chatStore';
import { StorageService } from '@/services/storage.service';

const store = useChatStore();
const messageText = ref<string>('');
const inputRef = ref<InstanceType<typeof CustomInput> | null>(null);
const messagesRef = ref<HTMLElement | null>(null);

const onGetNewMessage = (e?: StorageEvent): void => {
  try {
    const expectedKey = StorageService.getKey('history');
    if (e && e.key) {
      if (e.key !== expectedKey) return;
      if (!e.newValue) return;
      const parsed = JSON.parse(e.newValue) as Array<Record<string, unknown>>;
      const lastMessage = parsed[parsed.length - 1];
      if (lastMessage) store.addExternalMessage(lastMessage);
      return;
    }
    // fallback: explicitly reload full state
    store.loadState();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to handle storage event:', err);
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
  // ensure we load initial state and scroll to bottom
  store.loadState();
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
});

// auto-scroll when messages change
watch(
  () => store.messages.length,
  async () => {
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' });
    }
  }
);

onUnmounted((): void => {
  window.removeEventListener('storage', onGetNewMessage);
});
</script>

<style scoped>
.chat-screen {
  width: 92%;
  max-width: 900px;
  height: 80vh;
  margin: 2.25rem auto;
  background: linear-gradient(180deg, white 0%, #fbfdff 100%);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.chat-screen:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.chat-screen__messages {
  flex: 1;
  background: transparent;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  gap: 0.5rem;
}

.chat-screen__messages::-webkit-scrollbar {
  width: 8px;
}

.chat-screen__messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-screen__messages::-webkit-scrollbar-thumb {
  background: #00dc81;
  border-radius: 4px;
}

.chat-screen__messages::-webkit-scrollbar-thumb:hover {
  background: #00d975;
}

.chat-screen__panel {
  padding: 1rem 1.25rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,251,253,0.9));
  border-top: 1px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 72px;
}

.chat-screen__input-panel {
  display: flex;
  width: 100%;
  gap: 0.75rem;
  align-items: center;
}

.chat-screen__input {
  flex: 1;
  min-width: 0;
  border: 2px solid #e6eef6;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-size: 14px;
  transition: all 0.2s ease;
}

.chat-screen__input:focus {
  outline: none;
  border-color: #00dc81;
  box-shadow: 0 0 0 3px rgba(0, 220, 129, 0.1);
}

.chat-screen__button {
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.chat-screen__button--send {
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-2) 100%);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 220, 129, 0.3);
}

.chat-screen__button--send:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 220, 129, 0.4);
}

.chat-screen__button--send:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .chat-screen {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .chat-screen__messages {
    padding: 0.5rem;
  }

  .chat-screen__panel {
    padding: 1rem;
  }

  .chat-screen__input {
    min-width: 120px;
  }

  .chat-screen__button--send {
    padding: 0.6rem 1rem;
    font-size: 12px;
  }
}
</style>