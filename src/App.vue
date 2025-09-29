<template>
  <div class="app">
    <!-- 简化的头部 -->
    <header class="header">
      <h1 class="title">InkDot</h1>
      <div class="actions">
        <button class="btn" @click="createNewProject">新建</button>
        <button class="btn" @click="loadProject">加载</button>
        <button class="btn" :disabled="!canSave" @click="saveProject">保存</button>
      </div>
    </header>

    <!-- 简化的画布区域 -->
    <div class="canvas-container">
      <MindMapCanvas
        :nodes="nodes"
        :connections="connections"
        :selected-node-id="selectedNode?.id || null"
        @canvas-click="handleCanvasClick"
        @node-click="handleNodeClick"
        @node-content-update="handleNodeContentUpdate"
      />
    </div>

    <!-- 简化的状态栏 -->
    <div class="status-bar">
      <span>节点: {{ nodes.length }} | 按 Delete 删除选中节点</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import MindMapCanvas from '@/components/MindMapCanvas.vue';
import { useMindMapStore } from '@/stores/mindmap';
import type { Position } from '@/types';
import { computed, onMounted, onUnmounted } from 'vue';

// Store
const store = useMindMapStore();

// 计算属性
const nodes = computed(() => store.nodes);
const connections = computed(() => store.connections);
const selectedNode = computed(() => store.selectedNode);
const canSave = computed(() => store.isModified && nodes.value.length > 0);

// 项目操作方法
function createNewProject(): void {
  store.createNewProject();
}

function saveProject(): void {
  if (canSave.value) {
    store.saveCurrentProject();
  }
}

function loadProject(): void {
  store.loadProject();
  // 加载项目后重新计算布局
  setTimeout(() => {
    store.calculateTreeLayout();
  }, 100);
}

// 事件处理方法
function handleNodeClick(nodeId: string): void {
  store.selectNode(nodeId);
}

function handleNodeContentUpdate(nodeId: string, content: string): void {
  store.updateNodeContent(nodeId, content);
  // 更新内容后重新计算布局
  store.calculateTreeLayout();
}

// 移除了handleNodePositionUpdate函数，因为不再支持拖曳

function handleCanvasClick(position: Position): void {
  // 创建新节点
  const newNode = store.addNode({
    content: '新节点',
    position,
    connections: []
  });

  // 如果有选中的节点，创建连接
  if (selectedNode.value) {
    store.addConnection(selectedNode.value.id, newNode.id);
  }

  // 重新计算树状布局
  store.calculateTreeLayout();
}

// 键盘事件处理
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Delete' && selectedNode.value) {
    store.removeNode(selectedNode.value.id);
    // 删除节点后重新计算布局
    store.calculateTreeLayout();
  }

  // Ctrl+S 保存
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    saveProject();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  // 加载项目后重新计算布局
  store.calculateTreeLayout();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: #ffffff;
  color: #000000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #000000;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn:hover:not(:disabled) {
  background: #f9fafb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.status-bar {
  padding: 0.5rem 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
