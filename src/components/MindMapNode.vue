<template>
  <div
    class="node"
    :class="{ selected: props.isSelected, editing: isEditing, focused: isFocused }"
    :style="nodeStyle"
    :data-node-id="props.node.id"
    :tabindex="isFocused ? 0 : -1"
    :aria-label="`节点: ${props.node.content || '未命名节点'}`"
    :aria-selected="props.isSelected"
    :aria-expanded="hasChildren"
    role="treeitem"
    @click="handleClick"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- 显示模式 -->
    <div v-if="!isEditing" class="node-content" @click="startEdit">
      {{ props.node.content || '点击编辑' }}
    </div>

    <!-- 编辑模式 -->
    <input
      v-else
      ref="inputRef"
      v-model="editingContent"
      class="node-input"
      type="text"
      placeholder="输入节点内容..."
      @blur="saveEdit"
      @keydown.enter="saveEdit"
      @keydown.escape="cancelEdit"
      @keydown.tab.prevent
    />
  </div>
</template>

<script setup lang="ts">
import type { MindMapNode } from '@/types';
import { computed, nextTick, ref, watch } from 'vue';

// Props
interface Props {
  node: MindMapNode;
  isSelected?: boolean;
  isFocused?: boolean;
  hasChildren?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isFocused: false,
  hasChildren: false
});

// Emits
const emit = defineEmits<{
  click: [nodeId: string];
  updateContent: [nodeId: string, content: string];
  focus: [nodeId: string];
  blur: [nodeId: string];
}>();

// 响应式数据
const isEditing = ref(false);
const editingContent = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

// 计算属性
const nodeStyle = computed(() => ({
  transform: `translate(${props.node.position.x}px, ${props.node.position.y}px)`,
  transformOrigin: 'center center'
}));

// 方法
function handleClick(): void {
  if (!isEditing.value) {
    emit('click', props.node.id);
  }
}

function handleKeyDown(event: KeyboardEvent): void {
  if (isEditing.value) return;

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      startEdit();
      break;
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      event.preventDefault();
      // 由父组件处理导航
      break;
  }
}

function handleFocus(): void {
  emit('focus', props.node.id);
}

function handleBlur(): void {
  emit('blur', props.node.id);
}

function startEdit(): void {
  isEditing.value = true;
  editingContent.value = props.node.content;
}

function saveEdit(): void {
  emit('updateContent', props.node.id, editingContent.value.trim());
  isEditing.value = false;
}

function cancelEdit(): void {
  isEditing.value = false;
}

// 监听编辑状态，自动聚焦输入框
watch(isEditing, async newIsEditing => {
  if (newIsEditing) {
    await nextTick();
    inputRef.value?.focus();
    inputRef.value?.select();
  }
});
</script>

<style scoped>
.node {
  position: absolute;
  min-width: 80px;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #ffffff;
  border: 2px solid #d1d5db;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.node:hover {
  border-color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.node.focused {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

.node.editing {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.node-content {
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  color: #374151;
  min-width: 60px;
}

.node-input {
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  font-size: 14px;
  font-family: inherit;
  color: #1f2937;
  width: 100%;
  min-width: 60px;
}

.node.selected .node-input {
  color: #1e40af;
}

/* 响应式节点样式 */
@media (max-width: 768px) {
  .node {
    min-width: 60px;
    min-height: 35px;
    padding: 6px 10px;
    font-size: 12px;
  }

  .node-content {
    font-size: 12px;
    min-width: 50px;
  }

  .node-input {
    font-size: 12px;
    min-width: 50px;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .node {
    border-width: 3px;
    font-weight: 600;
  }

  .node.selected {
    outline: 3px solid #1e40af;
    outline-offset: 2px;
  }

  .node.focused {
    outline: 3px solid #1d4ed8;
    outline-offset: 2px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .node {
    background: #1f2937;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .node:hover {
    border-color: #6b7280;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .node.selected {
    border-color: #3b82f6;
    background: #1e3a8a;
  }

  .node.focused {
    border-color: #1d4ed8;
    background: #1e3a8a;
  }

  .node.editing {
    border-color: #3b82f6;
    background: #1e3a8a;
  }

  .node-content {
    color: #f9fafb;
  }

  .node-input {
    color: #f9fafb;
    background: transparent;
  }

  .node.selected .node-input {
    color: #bfdbfe;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .node {
    transition: none;
  }

  .node:hover,
  .node.selected,
  .node.focused,
  .node.editing {
    transition: none;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  .node {
    min-width: 80px;
    min-height: 45px;
    padding: 10px 15px;
  }

  .node:hover {
    border-color: #d1d5db;
    box-shadow: none;
  }
}
</style>
