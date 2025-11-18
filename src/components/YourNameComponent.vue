<template>
  <div class="name-screen">
    <div class="name-screen__card">
      <div class="name-screen__header">
        <h1 class="name-screen__title">
          Welcome to Chat
        </h1>
        <p class="name-screen__subtitle">
          Enter your name to get started
        </p>
      </div>

      <form
        class="name-screen__form"
        @submit.prevent="submitName"
      >
        <CustomInput
          v-model="name"
          placeholder="Your name..."
          class="name-screen__input"
          @enter="submitName"
        />
        <CustomButton
          class="name-screen__button"
          type="submit"
          :disabled="!name.trim()"
        >
          <span>Start Chatting</span>
        </CustomButton>
      </form>

      <p class="name-screen__hint">
        You can change your name anytime
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomInput from '@/components/ui/CustomInput.vue';
import CustomButton from '@/components/ui/CustomButton.vue';
import { useChatStore } from '@/store/chatStore';
import { generateId } from '@/utils';

const router = useRouter();
const store = useChatStore();
const name = ref<string>('');

const submitName = async (): Promise<void> => {
  if (!name.value.trim()) return;
  store.setUserInfo(name.value, generateId().toString());
  name.value = '';
  await router.push('/chat');
};
</script>

<style scoped>
.name-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.name-screen__card {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.name-screen__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.name-screen__title {
  margin: 0 0 0.5rem 0;
  font-size: 28px;
  font-weight: 700;
  color: #233759;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.name-screen__subtitle {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.name-screen__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.name-screen__input {
  width: 100%;
}

.name-screen__button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  font-size: 16px;
}

.name-screen__button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.name-screen__button:active:not(:disabled) {
  transform: translateY(-1px);
}

.name-screen__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.name-screen__hint {
  text-align: center;
  margin: 0;
  font-size: 12px;
  color: #bbb;
}

@media (max-width: 640px) {
  .name-screen {
    padding: 1rem;
  }

  .name-screen__card {
    padding: 2rem 1.5rem;
  }

  .name-screen__title {
    font-size: 24px;
  }

  .name-screen__button {
    padding: 0.75rem 1.25rem;
    font-size: 14px;
  }
}
</style>