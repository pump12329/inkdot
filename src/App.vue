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
      <div class="toolbar">
        <button type="button" class="btn btn-primary" @click="createNewProject">新建项目</button>
        <button type="button" class="btn btn-secondary" :disabled="!canSave" @click="saveProject">
          保存
        </button>
        <button type="button" class="btn btn-secondary" @click="loadProject">加载项目</button>
      </div>

      <!-- 思维导图画布 -->
      <div class="canvas-container">
        <canvas
          ref="canvasRef"
          class="mindmap-canvas"
          @click="handleCanvasClick"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
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
              @input="updateNode"
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
import { useMindMapStore } from '@/stores/mindmap';
import type { MindMapNode, Position } from '@/types';
import { computed, nextTick, onMounted, ref } from 'vue';

// Store
const store = useMindMapStore();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement | null>(null);
const showSidebar = ref(false);
const isDragging = ref(false);
const dragOffset = ref<Position>({ x: 0, y: 0 });

// 计算属性
const nodes = computed(() => store.nodes);
const connections = computed(() => store.connections);
const selectedNode = computed(() => store.selectedNode);
const currentProject = computed(() => store.currentProject);
const isProjectModified = computed(() => store.isModified);
const canSave = computed(() => isProjectModified.value && nodes.value.length > 0);

// 方法
function createNewProject(): void {
  store.createNewProject();
}

function saveProject(): void {
  if (canSave.value) {
    store.saveCurrentProject();
  }
}

function loadProject(): void {
  // 这里可以打开文件选择器或项目列表
  console.log('加载项目功能待实现');
}

function handleCanvasClick(event: MouseEvent): void {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const position: Position = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  // 检查是否点击了现有节点
  const clickedNode = findNodeAtPosition(position);

  if (clickedNode) {
    store.selectNode(clickedNode.id);
    showSidebar.value = true;
  } else {
    // 创建新节点
    const newNode: Omit<MindMapNode, 'id'> = {
      content: '新节点',
      position,
      connections: []
    };
    store.addNode(newNode);
  }
}

function handleMouseDown(event: MouseEvent): void {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const position: Position = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  const clickedNode = findNodeAtPosition(position);
  if (clickedNode) {
    isDragging.value = true;
    dragOffset.value = {
      x: position.x - clickedNode.position.x,
      y: position.y - clickedNode.position.y
    };
    store.selectNode(clickedNode.id);
  }
}

function handleMouseMove(event: MouseEvent): void {
  if (!isDragging.value || !selectedNode.value || !canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const newPosition: Position = {
    x: event.clientX - rect.left - dragOffset.value.x,
    y: event.clientY - rect.top - dragOffset.value.y
  };

  store.updateNodePosition(selectedNode.value.id, newPosition);
  drawCanvas();
}

function handleMouseUp(): void {
  isDragging.value = false;
}

function updateNode(): void {
  if (selectedNode.value) {
    store.updateNode(selectedNode.value.id, { content: selectedNode.value.content });
    drawCanvas();
  }
}

function closeSidebar(): void {
  showSidebar.value = false;
  store.clearSelection();
}

function findNodeAtPosition(position: Position): MindMapNode | null {
  for (const node of nodes.value) {
    const distance = Math.sqrt(
      Math.pow(position.x - node.position.x, 2) + Math.pow(position.y - node.position.y, 2)
    );
    if (distance <= 30) {
      // 节点半径
      return node;
    }
  }
  return null;
}

function drawCanvas(): void {
  if (!canvasRef.value) return;

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  // 绘制连接线
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  connections.value.forEach(connection => {
    const fromNode = nodes.value.find(n => n.id === connection.fromNodeId);
    const toNode = nodes.value.find(n => n.id === connection.toNodeId);

    if (fromNode && toNode) {
      ctx.beginPath();
      ctx.moveTo(fromNode.position.x, fromNode.position.y);
      ctx.lineTo(toNode.position.x, toNode.position.y);
      ctx.stroke();
    }
  });

  // 绘制节点
  nodes.value.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.position.x, node.position.y, 30, 0, 2 * Math.PI);

    // 节点样式
    if (selectedNode.value?.id === node.id) {
      ctx.fillStyle = '#007bff';
      ctx.strokeStyle = '#0056b3';
    } else {
      ctx.fillStyle = '#f8f9fa';
      ctx.strokeStyle = '#dee2e6';
    }

    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // 绘制文本
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      node.content.length > 8 ? node.content.substring(0, 8) + '...' : node.content,
      node.position.x,
      node.position.y
    );
  });
}

function resizeCanvas(): void {
  if (!canvasRef.value) return;

  const container = canvasRef.value.parentElement;
  if (container) {
    canvasRef.value.width = container.clientWidth;
    canvasRef.value.height = container.clientHeight;
    drawCanvas();
  }
}

// 生命周期
onMounted(async () => {
  await nextTick();
  if (canvasRef.value) {
    resizeCanvas();
  }

  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas);

  // 初始化示例数据
  if (nodes.value.length === 0) {
    store.addNode({
      content: '中心节点',
      position: { x: 400, y: 300 },
      connections: []
    });
  }
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e9ecef;
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
  color: #dc3545;
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
  color: #dc3545;
  font-weight: bold;
}

.main-content {
  flex: 1;
  display: flex;
  position: relative;
}

.toolbar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:hover {
  background: #f8f9fa;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: #fff;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
  border-color: #545b62;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.mindmap-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.sidebar {
  width: 300px;
  background: #f8f9fa;
  border-left: 1px solid #dee2e6;
  padding: 1rem;
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
  color: #6c757d;
}

.btn-close:hover {
  color: #495057;
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
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.input-text:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.status-bar {
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
}

.status-text {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
