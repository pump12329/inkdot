<template>
  <div
    class="mindmap-node"
    :class="{
      'mindmap-node--selected': isSelected,
      'mindmap-node--editing': isEditing,
      'mindmap-node--dragging': isDragging,
      'mindmap-node--primary': (node.level ?? 0) === 0,
      'mindmap-node--secondary': (node.level ?? 0) === 1,
      'mindmap-node--tertiary': (node.level ?? 0) >= 2
    }"
    :style="nodeStyle"
    :tabindex="isSelected ? 0 : -1"
    :aria-label="`思维导图节点: ${node.content}`"
    :aria-selected="isSelected"
    role="treeitem"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @mousedown="handleMouseDown"
    @keydown="handleKeyDown"
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
      :aria-label="`编辑节点内容: ${node.content}`"
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
  delete: [nodeId: string];
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

function handleKeyDown(event: KeyboardEvent): void {
  if (!isEditing.value) {
    switch (event.key) {
      case 'Enter':
        startEdit();
        break;
      case 'F2':
        startEdit();
        break;
      case 'Delete':
        emit('delete', props.node.id);
        break;
    }
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
