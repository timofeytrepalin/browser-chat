<template>
  <input
    class="input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @keyup.enter="emit('enter')"
  >
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
  placeholder?: string
}

interface Emits {
  'update:modelValue': [value: string]
  enter: []
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
});

const emit = defineEmits<Emits>();
</script>

<style scoped>
.input {
  padding: 0.75rem 1rem;
  font-size: 14px;
  line-height: 1.5;
  border: 2px solid #e0e6ed;
  min-height: 40px;
  outline: none;
  background-color: white;
  box-sizing: border-box;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input::placeholder {
  color: #bbb;
}

.input:focus {
  border-color: #00dc81;
  background-color: #f8f9fa;
  box-shadow: 0 0 0 3px rgba(0, 220, 129, 0.1);
}

.input:hover:not(:focus) {
  border-color: #d0d6dd;
}

@media (max-width: 640px) {
  .input {
    padding: 0.65rem 0.875rem;
    font-size: 13px;
    min-height: 36px;
  }
}
</style>