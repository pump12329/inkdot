<template>
  <div class="app" :class="{ 'dark-theme': isDarkMode }">
    <!-- 全屏画布区域 -->
    <div class="canvas-container">
      <MindMapCanvas
        :nodes="nodes"
        :connections="connections"
        :selected-node-id="selectedNode?.id || null"
        @canvas-click="handleCanvasClick"
        @node-click="handleNodeClick"
        @node-content-update="handleNodeContentUpdate"
        @add-child-node="handleAddChildNode"
        @copy-node="handleCopyNode"
        @delete-node="handleDeleteNode"
        @toggle-node-expand="handleToggleNodeExpand"
        @import="handleImport"
        @export="handleExport"
        @reset-zoom="handleResetZoom"
        @toggle-theme="toggleThemeMode"
      />
    </div>

    <!-- 无障碍支持 -->
    <div id="accessibility-live-region" class="sr-only" aria-live="polite" aria-atomic="true">
      {{ announcementText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import MindMapCanvas from '@/components/MindMapCanvas.vue';
import { useMindMapStore } from '@/stores/mindmap';
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation';
import { useTheme } from '@/composables/useTheme';
import type { Position } from '@/types';
import { computed, onMounted, onUnmounted } from 'vue';

// Store
const store = useMindMapStore();

// 主题管理
const { isDarkMode, toggleThemeMode } = useTheme();

// 计算属性
const nodes = computed(() => store.nodes);
const connections = computed(() => store.connections);
const selectedNode = computed(() => store.selectedNode);
const canSave = computed(() => store.isModified && nodes.value.length > 0);

// 键盘导航
const { announcementText } = useKeyboardNavigation(
  nodes.value,
  connections.value,
  selectedNode.value?.id || null,
  store.selectNode
);

// 项目操作方法
function saveProject(): void {
  if (canSave.value) {
    store.saveCurrentProject();
  }
}

// 悬浮按钮栏操作方法
function handleImport(): void {
  // TODO: 实现导入功能
  console.log('导入功能');
}

function handleExport(): void {
  // TODO: 实现导出功能
  console.log('导出功能');
}

function handleResetZoom(): void {
  // TODO: 实现缩放重置功能
  console.log('重置缩放');
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

function handleCanvasClick(): void {
  // 禁止通过点击画布空白区域创建节点
  // 仅用于取消选择或关闭悬浮按钮栏
  if (selectedNode.value) {
    store.selectNode(null);
  }
}

function handleAddChildNode(parentId: string, position: Position): void {
  // 创建子节点
  const childNode = store.addNode({
    content: '子节点',
    position,
    connections: []
  });

  // 创建父子连接
  store.addConnection(parentId, childNode.id);

  // 重新计算树状布局
  store.calculateTreeLayout();
}

function handleCopyNode(nodeId: string): void {
  store.copyNode(nodeId);
}

function handleDeleteNode(nodeId: string): void {
  store.removeNode(nodeId);
  // 删除节点后重新计算布局
  store.calculateTreeLayout();
}

function handleToggleNodeExpand(nodeId: string): void {
  store.toggleNodeExpand(nodeId);
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
  background: var(--color-background, #ffffff);
  color: var(--color-text-primary, #000000);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.app.dark-theme {
  background: var(--color-background, #111827);
  color: var(--color-text-primary, #f9fafb);
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--color-background, #ffffff);
  transition: background-color 0.3s ease;
}
</style>
