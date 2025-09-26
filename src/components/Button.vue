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
  const variant = `btn-${props.variant}`;
  const size = `btn-${props.size}`;
  const disabled = props.disabled ? 'disabled' : '';

  return [base, variant, size, disabled].filter(Boolean).join(' ');
});

// 方法
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>
