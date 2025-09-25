<template>
  <div id="app" class="app">
    <!-- 极简头部 -->
    <header class="header">
      <div class="header-content" :class="{ modified: isProjectModified }">
        <h1 class="title">InkDot</h1>
        <div v-if="currentProject" class="project-info">
          <span class="project-name">{{ currentProject.name }}</span>
          <span v-if="isProjectModified" class="modified-indicator">*</span>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 工具栏 -->
      <Toolbar
        :can-save="canSave"
        :can-undo="false"
        :can-redo="false"
        :has-selection="selectedNode !== null"
        :can-connect="false"
        :zoom-level="1"
        @new-project="createNewProject"
        @save-project="saveProject"
        @load-project="loadProject"
        @delete-node="deleteSelectedNode"
        @zoom-in="handleZoomIn"
        @zoom-out="handleZoomOut"
      />

      <!-- 思维导图画布 -->
      <div class="canvas-container">
        <MindMapCanvas
          :nodes="nodes"
          :connections="connections"
          :selected-node-id="selectedNode?.id || null"
          :canvas-size="{ width: 1200, height: 800 }"
          @node-click="handleNodeClick"
          @node-double-click="handleNodeDoubleClick"
          @node-content-update="handleNodeContentUpdate"
          @node-position-update="handleNodePositionUpdate"
          @canvas-click="handleCanvasClick"
          @selection-change="handleSelectionChange"
        />
      </div>

      <!-- 侧边栏 -->
      <aside v-show="showSidebar" class="sidebar">
        <div class="sidebar-header">
          <h3>节点属性</h3>
          <button type="button" class="btn-close" @click="closeSidebar">×</button>
        </div>
        <div v-if="selectedNode" class="node-properties">
          <div class="property-group">
            <label for="node-content">内容：</label>
            <input
              id="node-content"
              v-model="selectedNode.content"
              type="text"
              class="input-text"
              @input="updateNodeContent"
            />
          </div>
        </div>
      </aside>
    </main>

    <!-- 状态栏 -->
    <footer class="status-bar">
      <span class="status-text">节点数: {{ nodes.length }} | 连接数: {{ connections.length }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import MindMapCanvas from '@/components/MindMapCanvas.vue';
import Toolbar from '@/components/Toolbar.vue';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
import { useMindMapInteraction } from '@/composables/useMindMapInteraction';
import { useMindMapStore } from '@/stores/mindmap';
import type { Position } from '@/types';
import { computed, ref } from 'vue';

// Store 和组合式函数
const store = useMindMapStore();
const interaction = useMindMapInteraction();

// 响应式数据
const showSidebar = ref(false);

// 计算属性
const nodes = computed(() => store.nodes);
const connections = computed(() => store.connections);
const selectedNode = computed(() => store.selectedNode);
const currentProject = computed(() => store.currentProject);
const isProjectModified = computed(() => store.isModified);
const canSave = computed(() => isProjectModified.value && nodes.value.length > 0);

// 键盘快捷键
useKeyboardShortcuts({
  onNew: createNewProject,
  onSave: saveProject,
  onDelete: deleteSelectedNode,
  onEscape: () => interaction.selectNode(null)
});

// 项目操作方法
function createNewProject(): void {
  store.createNewProject();
  showSidebar.value = false;
}

function saveProject(): void {
  if (canSave.value) {
    store.saveCurrentProject();
  }
}

function loadProject(): void {
  // TODO: 实现文件选择器功能
  console.log('加载项目功能待实现');
}

// 事件处理方法
function handleNodeClick(nodeId: string, _event: MouseEvent): void {
  interaction.selectNode(nodeId);
  showSidebar.value = true;
}

function handleNodeDoubleClick(nodeId: string): void {
  interaction.selectNode(nodeId);
}

function handleNodeContentUpdate(nodeId: string, content: string): void {
  interaction.updateNodeContent(nodeId, content);
}

function handleNodePositionUpdate(nodeId: string, position: Position): void {
  interaction.updateNodePosition(nodeId, position);
}

function handleCanvasClick(position: Position, _event: MouseEvent): void {
  // 创建新节点
  interaction.createNodeAtPosition(position, '新节点');
  showSidebar.value = false;
}

function handleSelectionChange(nodeId: string | null): void {
  interaction.selectNode(nodeId);
  showSidebar.value = nodeId !== null;
}

// 工具栏操作方法
function deleteSelectedNode(): void {
  interaction.deleteSelectedNode();
  showSidebar.value = false;
}

function handleZoomIn(): void {
  console.log('放大视图');
}

function handleZoomOut(): void {
  console.log('缩小视图');
}

function updateNodeContent(): void {
  if (selectedNode.value) {
    interaction.updateNodeContent(selectedNode.value.id, selectedNode.value.content);
  }
}

function closeSidebar(): void {
  showSidebar.value = false;
  interaction.selectNode(null);
}
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC',
    'WenQuanYi Micro Hei', system-ui, sans-serif;
  background: #ffffff;
  color: #000000;
}

.header {
  background: #ffffff;
  border-bottom: 1px solid #00000022;
  padding: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.header-content.modified {
  color: #000000;
}

.header-content.modified .modified-indicator {
  color: #000000;
  opacity: 0.7;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-name {
  font-weight: 500;
}

.modified-indicator {
  color: #000000;
  font-weight: bold;
  opacity: 0.7;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.sidebar {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #00000022;
  padding: 1rem;
  z-index: 10;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #00000066;
}

.btn-close:hover {
  color: #000000;
}

.property-group {
  margin-bottom: 1rem;
}

.property-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-text {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #00000022;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #ffffff;
  color: #000000;
}

.input-text:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1);
}

.status-bar {
  background: #ffffff;
  border-top: 1px solid #00000022;
  padding: 0.5rem 1rem;
}

.status-text {
  font-size: 0.875rem;
  color: #00000066;
}
</style>
