<template>
    <button
        :class="buttonClasses"
        :disabled="disabled"
        :type="type"
        @click="handleClick"
    >
        <slot name="icon" />
        <span v-if="$slots.default" :class="textClasses">
            <slot />
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
    block: false
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
    const baseClasses = [
        'inline-flex',
        'items-center',
        'justify-center',
        'font-medium',
        'transition-all',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed'
    ]

    // 尺寸样式
    const sizeClasses = {
        sm: ['px-3', 'py-1.5', 'text-sm', 'rounded-md'],
        md: ['px-4', 'py-2', 'text-base', 'rounded-md'],
        lg: ['px-6', 'py-3', 'text-lg', 'rounded-lg']
    }

    // 变体样式
    const variantClasses = {
        primary: [
            'bg-blue-600',
            'text-white',
            'hover:bg-blue-700',
            'focus:ring-blue-500',
            'active:bg-blue-800'
        ],
        secondary: [
            'bg-gray-600',
            'text-white',
            'hover:bg-gray-700',
            'focus:ring-gray-500',
            'active:bg-gray-800'
        ],
        outline: [
            'border',
            'border-blue-600',
            'text-blue-600',
            'bg-transparent',
            'hover:bg-blue-50',
            'focus:ring-blue-500',
            'active:bg-blue-100'
        ],
        ghost: [
            'text-blue-600',
            'bg-transparent',
            'hover:bg-blue-50',
            'focus:ring-blue-500',
            'active:bg-blue-100'
        ],
        danger: [
            'bg-red-600',
            'text-white',
            'hover:bg-red-700',
            'focus:ring-red-500',
            'active:bg-red-800'
        ]
    }

    const classes = [
        ...baseClasses,
        ...sizeClasses[props.size],
        ...variantClasses[props.variant]
    ]

    if (props.block) {
        classes.push('w-full')
    }

    if (props.loading) {
        classes.push('cursor-wait')
    }

    return classes.join(' ')
})

const textClasses = computed(() => {
    return props.loading ? 'opacity-0' : 'opacity-100'
})

const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
        emit('click', event)
    }
}
</script>
