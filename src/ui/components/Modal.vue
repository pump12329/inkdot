<template>
    <Teleport to="body">
        <Transition
            name="modal"
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="modelValue"
                class="fixed inset-0 z-50 overflow-y-auto"
                @click="handleBackdropClick"
            >
                <!-- 背景遮罩 -->
                <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
                
                <!-- 模态框容器 -->
                <div class="flex min-h-full items-center justify-center p-4">
                    <Transition
                        name="modal-content"
                        enter-active-class="transition-all duration-300"
                        enter-from-class="opacity-0 scale-95 translate-y-4"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition-all duration-200"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 translate-y-4"
                    >
                        <div
                            v-if="modelValue"
                            :class="modalClasses"
                            @click.stop
                        >
                            <!-- 头部 -->
                            <div v-if="title || $slots.header" class="modal-header">
                                <slot name="header">
                                    <h3 class="text-lg font-semibold text-gray-900">
                                        {{ title }}
                                    </h3>
                                </slot>
                                
                                <button
                                    v-if="closable"
                                    type="button"
                                    class="close-button"
                                    @click="handleClose"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- 内容 -->
                            <div class="modal-content">
                                <slot />
                            </div>
                            
                            <!-- 底部 -->
                            <div v-if="$slots.footer" class="modal-footer">
                                <slot name="footer" />
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Props {
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closable?: boolean
    maskClosable?: boolean
    centered?: boolean
    scrollable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    closable: true,
    maskClosable: true,
    centered: true,
    scrollable: false
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    close: []
    open: []
}>()

const modalClasses = computed(() => {
    const baseClasses = [
        'relative',
        'bg-white',
        'rounded-lg',
        'shadow-xl',
        'transform',
        'transition-all'
    ]

    // 尺寸样式
    const sizeClasses = {
        sm: ['max-w-sm', 'w-full'],
        md: ['max-w-md', 'w-full'],
        lg: ['max-w-lg', 'w-full'],
        xl: ['max-w-xl', 'w-full'],
        full: ['max-w-full', 'w-full', 'mx-4']
    }

    return [
        ...baseClasses,
        ...sizeClasses[props.size]
    ].join(' ')
})

const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
}

const handleBackdropClick = () => {
    if (props.maskClosable) {
        handleClose()
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.closable) {
        handleClose()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-header {
    @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-content {
    @apply p-6;
}

.modal-footer {
    @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg;
}

.close-button {
    @apply text-gray-400 hover:text-gray-600 transition-colors duration-200;
}
</style>
