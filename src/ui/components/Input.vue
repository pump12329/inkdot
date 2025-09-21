<template>
    <div class="input-wrapper">
        <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>
        
        <div class="relative">
            <input
                :id="inputId"
                ref="inputRef"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :maxlength="maxlength"
                :min="min"
                :max="max"
                :step="step"
                :class="inputClasses"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown="handleKeydown"
            />
            
            <!-- 前置图标 -->
            <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <slot name="prefix" />
            </div>
            
            <!-- 后置图标 -->
            <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <slot name="suffix" />
            </div>
            
            <!-- 清除按钮 -->
            <button
                v-if="clearable && modelValue && !disabled && !readonly"
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                @click="handleClear"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <!-- 帮助文本 -->
        <p v-if="helpText" class="mt-1 text-sm text-gray-500">
            {{ helpText }}
        </p>
        
        <!-- 错误信息 -->
        <p v-if="error" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
        
        <!-- 字符计数 -->
        <p v-if="showCount && maxlength" class="mt-1 text-sm text-gray-500 text-right">
            {{ (modelValue || '').length }}/{{ maxlength }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
    modelValue?: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    label?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    error?: string
    helpText?: string
    maxlength?: number
    min?: number
    max?: number
    step?: number
    clearable?: boolean
    showCount?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    readonly: false,
    required: false,
    clearable: false,
    showCount: false,
    size: 'md'
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
    keydown: [event: KeyboardEvent]
    clear: []
}>()

const inputRef = ref<HTMLInputElement>()
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const inputClasses = computed(() => {
    const baseClasses = [
        'block',
        'w-full',
        'border',
        'rounded-md',
        'transition-colors',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-0',
        'disabled:bg-gray-50',
        'disabled:text-gray-500',
        'disabled:cursor-not-allowed',
        'read-only:bg-gray-50',
        'read-only:cursor-default'
    ]

    // 尺寸样式
    const sizeClasses = {
        sm: ['px-3', 'py-1.5', 'text-sm'],
        md: ['px-3', 'py-2', 'text-base'],
        lg: ['px-4', 'py-3', 'text-lg']
    }

    // 状态样式
    const stateClasses = props.error
        ? ['border-red-300', 'focus:border-red-500', 'focus:ring-red-500']
        : ['border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500']

    // 前置/后置图标样式
    const iconClasses = []
    if (props.$slots?.prefix) {
        iconClasses.push('pl-10')
    }
    if (props.$slots?.suffix || props.clearable) {
        iconClasses.push('pr-10')
    }

    return [
        ...baseClasses,
        ...sizeClasses[props.size],
        ...stateClasses,
        ...iconClasses
    ].join(' ')
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value: string | number = target.value

    if (props.type === 'number') {
        value = target.valueAsNumber || 0
    }

    emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
    emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
    emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
    emit('keydown', event)
}

const handleClear = () => {
    emit('update:modelValue', '')
    emit('clear')
    inputRef.value?.focus()
}

// 暴露方法
defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur(),
    select: () => inputRef.value?.select()
})
</script>
