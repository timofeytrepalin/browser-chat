<template>
  <div class="name-input">
    <p class="name-input__title">
      Введите ваше имя
    </p>
    <CustomInput
      v-model="name"
      @enter="submitName"
    />
    <CustomButton
      class="name-input__button"
      @click="submitName"
    >
      <span>Сохранить</span>
    </CustomButton>
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
.name-input__title {
  margin-bottom: 2rem;
  font-weight: 600;
}

.name-input__button {
  background-color: #00dc81;
  color: white;
  margin-top: 1rem;
}

.name-input__button:hover {
  background-color: #00dc808a;
}
</style>