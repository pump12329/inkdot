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
    <!-- 展开/折叠按钮 -->
    <button
      v-if="props.hasChildren"
      class="expand-btn"
      :title="props.isExpanded ? '折叠分支' : '展开分支'"
      :aria-label="props.isExpanded ? '折叠分支' : '展开分支'"
      @click="toggleExpand"
      @keydown="handleExpandKeydown"
    >
      <ChevronRight v-if="!props.isExpanded" :size="16" :stroke-width="2" aria-hidden="true" />
      <ChevronDown v-else :size="16" :stroke-width="2" aria-hidden="true" />
    </button>

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
import { ChevronRight, ChevronDown } from 'lucide-vue-next';

// Props
interface Props {
  node: MindMapNode;
  isSelected?: boolean;
  isFocused?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isFocused: false,
  hasChildren: false,
  isExpanded: true
});

// Emits
const emit = defineEmits<{
  click: [nodeId: string];
  updateContent: [nodeId: string, content: string];
  focus: [nodeId: string];
  blur: [nodeId: string];
  toggleExpand: [nodeId: string];
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

function toggleExpand(event?: MouseEvent): void {
  if (event) {
    event.stopPropagation();
  }
  emit('toggleExpand', props.node.id);
}

function handleExpandKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
    toggleExpand();
  }
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
  background: var(--color-surface, #ffffff);
  border: 2px solid var(--color-border, #d1d5db);
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.node:hover {
  border-color: var(--color-border-hover, #9ca3af);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.15));
  transform: translateY(-1px);
}

.node.selected {
  border-color: var(--color-accent, #3b82f6);
  background: var(--color-accent-50, #eff6ff);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.node.focused {
  border-color: var(--color-accent-hover, #1d4ed8);
  box-shadow:
    0 0 0 3px rgba(29, 78, 216, 0.2),
    0 0 20px rgba(29, 78, 216, 0.3);
  outline: 2px solid var(--color-accent-hover, #1d4ed8);
  outline-offset: 2px;
}

.node.editing {
  border-color: var(--color-accent, #3b82f6);
  background: var(--color-accent-50, #eff6ff);
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.3),
    0 0 25px rgba(59, 130, 246, 0.4);
}

.node-content {
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  color: var(--color-text-primary, #374151);
  min-width: 60px;
}

.node-input {
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text-primary, #1f2937);
  width: 100%;
  min-width: 60px;
}

.node.selected .node-input {
  color: var(--color-accent-700, #1e40af);
}

.expand-btn {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border, #d1d5db);
  background: var(--color-surface, #ffffff);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #6b7280);
  transition: all 0.2s ease;
  z-index: 10;
}

.expand-btn:hover {
  background: var(--color-surface-hover, #f3f4f6);
  border-color: var(--color-border-hover, #9ca3af);
  color: var(--color-text-primary, #374151);
  transform: translateY(-50%) scale(1.1);
}

.expand-btn:focus-visible {
  outline: 2px solid var(--color-accent, #3b82f6);
  outline-offset: 2px;
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

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  /* 使用CSS变量，无需额外覆盖 */
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
    border-color: var(--color-border, #d1d5db);
    box-shadow: none;
  }
}
</style>
