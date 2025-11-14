<template>
  <input
    class="input"
    :type="type"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @keyup.enter="emit('enter')"
  >
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
}

interface Emits {
  'update:modelValue': [value: string]
  enter: []
}

withDefaults(defineProps<Props>(), {
  type: 'text',
});

const emit = defineEmits<Emits>();
</script>

<style scoped>
.input {
  padding: 0.5rem 1rem;
  font-size: 14px;
  line-height: 1;
  border: 2px solid transparent;
  min-height: 40px;
  outline: none;
  background-color: rgb(245, 248, 252);
  box-sizing: border-box;
  border-radius: 4px;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: #00dc81;
}

@media (max-width: 640px) {
  .input {
    padding: 0.25rem 0.5rem;
  }
}
</style>