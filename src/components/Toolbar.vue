<template>
  <div class="toolbar">
    <div class="toolbar-section">
      <Button variant="primary" size="sm" @click="handleNewProject">新建</Button>
      <Button variant="secondary" size="sm" :disabled="!canSave" @click="handleSaveProject">
        保存
      </Button>
      <Button variant="secondary" size="sm" @click="handleLoadProject">加载</Button>
    </div>

    <div class="toolbar-divider" />

    <div class="toolbar-section">
      <Button
        variant="ghost"
        size="sm"
        :disabled="!canUndo"
        title="撤销 (Ctrl+Z)"
        @click="handleUndo"
      >
        撤销
      </Button>
      <Button
        variant="ghost"
        size="sm"
        :disabled="!canRedo"
        title="重做 (Ctrl+Y)"
        @click="handleRedo"
      >
        重做
      </Button>
    </div>

    <div class="toolbar-divider" />

    <div class="toolbar-section">
      <Button
        variant="ghost"
        size="sm"
        :disabled="!hasSelection"
        title="删除节点 (Delete)"
        @click="handleDeleteNode"
      >
        删除
      </Button>
      <Button
        variant="ghost"
        size="sm"
        :disabled="!canConnect"
        title="连接节点"
        @click="handleConnectNodes"
      >
        连接
      </Button>
    </div>

    <div class="toolbar-spacer" />

    <div class="toolbar-section">
      <div class="zoom-controls">
        <Button variant="ghost" size="sm" title="缩小" @click="handleZoomOut">-</Button>
        <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
        <Button variant="ghost" size="sm" title="放大" @click="handleZoomIn">+</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

// Props
interface Props {
  canSave?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
  canConnect?: boolean;
  zoomLevel?: number;
}

const props = withDefaults(defineProps<Props>(), {
  canSave: false,
  canUndo: false,
  canRedo: false,
  hasSelection: false,
  canConnect: false,
  zoomLevel: 1
});

// Emits
const emit = defineEmits<{
  newProject: [];
  saveProject: [];
  loadProject: [];
  undo: [];
  redo: [];
  deleteNode: [];
  connectNodes: [];
  zoomIn: [];
  zoomOut: [];
}>();

// 方法
function handleNewProject(): void {
  emit('newProject');
}

function handleSaveProject(): void {
  if (props.canSave) {
    emit('saveProject');
  }
}

function handleLoadProject(): void {
  emit('loadProject');
}

function handleUndo(): void {
  if (props.canUndo) {
    emit('undo');
  }
}

function handleRedo(): void {
  if (props.canRedo) {
    emit('redo');
  }
}

function handleDeleteNode(): void {
  if (props.hasSelection) {
    emit('deleteNode');
  }
}

function handleConnectNodes(): void {
  if (props.canConnect) {
    emit('connectNodes');
  }
}

function handleZoomIn(): void {
  emit('zoomIn');
}

function handleZoomOut(): void {
  emit('zoomOut');
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid #00000022;
  user-select: none;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.toolbar-divider {
  width: 1px;
  height: 1.5rem;
  background: #00000022;
  margin: 0 0.25rem;
}

.toolbar-spacer {
  flex: 1;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-level {
  font-size: 0.75rem;
  color: #00000088;
  min-width: 3rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar {
    padding: 0.5rem;
    gap: 0.25rem;
  }

  .toolbar-section {
    gap: 0.125rem;
  }

  .toolbar-divider {
    margin: 0 0.125rem;
  }
}
</style>
