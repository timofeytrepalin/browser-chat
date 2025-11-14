<template>
  <button
    class="btn"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Emits {
  click: []
}

const emit = defineEmits<Emits>();
</script>

<style scoped>
.btn {
  transition: all 0.2s ease;
  min-height: 40px;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn:active {
  transform: scale(0.98);
}

@media (max-width: 640px) {
  .btn {
    padding: 0.25rem 0.5rem;
    font-size: 12px;
  }
}
</style>