<template>
  <div
    class="mindmap-node"
    :class="{
      'mindmap-node--selected': isSelected,
      'mindmap-node--editing': isEditing,
      'mindmap-node--dragging': isDragging
    }"
    :style="nodeStyle"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @mousedown="handleMouseDown"
  >
    <div v-if="!isEditing" class="node-content">
      {{ node.content }}
    </div>
    <input
      v-else
      ref="inputRef"
      v-model="editingContent"
      class="node-input"
      type="text"
      @blur="handleSaveEdit"
      @keydown.enter="handleSaveEdit"
      @keydown.escape="handleCancelEdit"
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
  isDragging?: boolean;
  scale?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDragging: false,
  scale: 1
});

// Emits
const emit = defineEmits<{
  click: [nodeId: string, event: MouseEvent];
  doubleClick: [nodeId: string];
  mouseDown: [nodeId: string, event: MouseEvent];
  updateContent: [nodeId: string, content: string];
}>();

// 响应式数据
const isEditing = ref(false);
const editingContent = ref(props.node.content);
const inputRef = ref<HTMLInputElement | null>(null);

// 计算属性
const nodeStyle = computed(() => ({
  transform: `translate(${props.node.position.x}px, ${props.node.position.y}px) scale(${props.scale})`,
  transformOrigin: 'center center'
}));

// 方法
function handleClick(event: MouseEvent): void {
  if (!isEditing.value) {
    emit('click', props.node.id, event);
  }
}

function handleDoubleClick(): void {
  if (!isEditing.value) {
    startEdit();
  }
}

function handleMouseDown(event: MouseEvent): void {
  if (!isEditing.value) {
    emit('mouseDown', props.node.id, event);
  }
}

function startEdit(): void {
  isEditing.value = true;
  editingContent.value = props.node.content;
  emit('doubleClick', props.node.id);
}

function handleSaveEdit(): void {
  if (editingContent.value.trim() !== '') {
    emit('updateContent', props.node.id, editingContent.value.trim());
  }
  isEditing.value = false;
}

function handleCancelEdit(): void {
  editingContent.value = props.node.content;
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
.mindmap-node {
  position: absolute;
  min-width: 60px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #00000022;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-family:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC',
    'WenQuanYi Micro Hei', system-ui, sans-serif;
}

.mindmap-node:hover {
  border-color: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mindmap-node--selected {
  border-color: #000000;
  background: #000000;
  color: #ffffff;
}

.mindmap-node--editing {
  border-color: #000000;
}

.mindmap-node--dragging {
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.node-content {
  padding: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.2;
  word-break: break-word;
  max-width: 100px;
}

.node-input {
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  font-size: 0.875rem;
  font-family: inherit;
  color: inherit;
  width: 100%;
  padding: 0.5rem;
}

.mindmap-node--selected .node-input {
  color: #ffffff;
}

.mindmap-node--selected .node-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
</style>
