<template>
  <button
    class="btn"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  type?: string
}

interface Emits {
  click: []
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'button',
});

const emit = defineEmits<Emits>();
</script>

<style scoped>
.btn {
  transition: all 0.3s ease;
  min-height: 40px;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #00dc81 0%, #00d975 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 220, 129, 0.3);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 220, 129, 0.4);
}

.btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .btn {
    padding: 0.5rem 1rem;
    font-size: 13px;
    min-height: 36px;
  }
}
</style>