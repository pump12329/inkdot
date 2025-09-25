<template>
  <button :class="buttonClass" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
});

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// 计算属性
const buttonClass = computed(() => {
  const base = 'btn';
  const variant = `btn--${props.variant}`;
  const size = `btn--${props.size}`;
  const disabled = props.disabled ? 'btn--disabled' : '';

  return [base, variant, size, disabled].filter(Boolean).join(' ');
});

// 方法
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.15s;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn--md {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* 极简主义配色方案 */
.btn--primary {
  background-color: #000000;
  color: #ffffff;
}

.btn--primary:hover:not(.btn--disabled) {
  background-color: #000000;
  opacity: 0.8;
}

.btn--secondary {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #00000022;
}

.btn--secondary:hover:not(.btn--disabled) {
  background-color: #00000005;
}

.btn--ghost {
  background-color: transparent;
  color: #000000;
}

.btn--ghost:hover:not(.btn--disabled) {
  background-color: #00000005;
}

.btn--danger {
  background-color: #000000;
  color: #ffffff;
}

.btn--danger:hover:not(.btn--disabled) {
  background-color: #000000;
  opacity: 0.8;
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
