<template>
  <div
    class="canvas-container"
    :class="{
      mobile: isMobile,
      tablet: isTablet,
      desktop: isDesktop,
      landscape: canvasOrientation === 'landscape',
      portrait: canvasOrientation === 'portrait'
    }"
  >
    <!-- 控制面板 -->
    <div class="controls" :class="layoutParams.controlsSize">
      <button class="control-btn" title="放大 (+)" aria-label="放大画布" @click="zoomIn">
        <span aria-hidden="true">+</span>
      </button>
      <button class="control-btn" title="缩小 (-)" aria-label="缩小画布" @click="zoomOut">
        <span aria-hidden="true">−</span>
      </button>
      <button
        class="control-btn"
        title="适应内容 (F)"
        aria-label="适应内容大小"
        @click="fitToContent()"
      >
        <span aria-hidden="true">⤢</span>
      </button>
      <button class="control-btn" title="重置视图 (0)" aria-label="重置视图" @click="resetZoom">
        <span aria-hidden="true">⟲</span>
      </button>
      <div class="zoom-info" role="status" aria-live="polite">{{ Math.round(scale * 100) }}%</div>
    </div>

    <!-- 画布 -->
    <div
      class="canvas"
      :class="{ panning: isPanning }"
      @click="handleCanvasClick"
      @mousedown="startPan"
      @wheel="handleWheel"
    >
      <!-- 连接线层 -->
      <svg
        class="connections"
        :style="{ transform: transformStyle, transformOrigin: transformOrigin }"
      >
        <line
          v-for="connection in props.connections"
          :key="connection.id"
          :x1="getNodePosition(connection.fromNodeId).x"
          :y1="getNodePosition(connection.fromNodeId).y"
          :x2="getNodePosition(connection.toNodeId).x"
          :y2="getNodePosition(connection.toNodeId).y"
          stroke="#d1d5db"
          stroke-width="2"
        />
      </svg>

      <!-- 节点层 -->
      <div class="nodes" :style="{ transform: transformStyle, transformOrigin: transformOrigin }">
        <MindMapNodeComponent
          v-for="node in props.nodes"
          :key="node.id"
          :node="node"
          :is-selected="props.selectedNodeId === node.id"
          :has-children="hasChildren(node.id)"
          @click="handleNodeClick"
          @update-content="handleNodeContentUpdate"
        />
      </div>
    </div>

    <!-- 帮助信息 -->
    <div class="help-info" role="status" aria-live="polite">
      <span v-if="isPanning">正在平移画布...</span>
      <span v-else-if="scale !== 1">缩放: {{ Math.round(scale * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MindMapNode, NodeConnection, Position } from '@/types';
import MindMapNodeComponent from './MindMapNode.vue';
import { useCanvasView } from '@/composables/useCanvasView';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import { watch, nextTick } from 'vue';

// Props
interface Props {
  nodes: MindMapNode[];
  connections: NodeConnection[];
  selectedNodeId?: string | null;
}

const props = defineProps<Props>();

// 响应式布局
const { isMobile, isTablet, isDesktop, layoutParams, getOptimalZoom, canvasOrientation } =
  useResponsiveLayout();

// 监听节点和连接变化，更新画布尺寸
watch(
  [() => props.nodes, () => props.connections],
  async () => {
    await nextTick();

    // 计算内容尺寸
    let maxX = 0;
    let maxY = 0;

    props.nodes.forEach(node => {
      maxX = Math.max(maxX, node.position.x + layoutParams.value.nodeWidth);
      maxY = Math.max(maxY, node.position.y + layoutParams.value.nodeHeight);
    });

    const contentWidth = Math.max(800, maxX + layoutParams.value.padding);
    const contentHeight = Math.max(600, maxY + layoutParams.value.padding);

    updateContentSize(contentWidth, contentHeight);

    // 在移动端自动调整缩放
    if (isMobile.value) {
      setTimeout(() => {
        setScale(getOptimalZoom.value);
      }, 100);
    }
  },
  { deep: true, immediate: true }
);

// 监听设备类型变化，调整布局
watch(isMobile, newValue => {
  if (newValue) {
    // 移动端优化
    setScale(getOptimalZoom.value);
  }
});

// Emits
const emit = defineEmits<{
  nodeClick: [nodeId: string];
  nodeContentUpdate: [nodeId: string, content: string];
  canvasClick: [position: Position];
}>();

// 使用画布视图管理
const {
  scale,
  offset,
  isPanning,
  transformStyle,
  transformOrigin,
  zoomIn,
  zoomOut,
  setScale,
  resetZoom,
  fitToContent,
  updateContentSize,
  startPan,
  handleKeyDown
} = useCanvasView();

// 方法
function getNodePosition(nodeId: string): Position {
  const node = props.nodes.find(n => n.id === nodeId);
  return node ? node.position : { x: 0, y: 0 };
}

function hasChildren(nodeId: string): boolean {
  return props.connections.some(conn => conn.fromNodeId === nodeId);
}

function handleNodeClick(nodeId: string): void {
  emit('nodeClick', nodeId);
}

function handleNodeContentUpdate(nodeId: string, content: string): void {
  emit('nodeContentUpdate', nodeId, content);
}

function handleCanvasClick(event: MouseEvent): void {
  // 如果正在平移，不创建新节点
  if (isPanning.value) return;

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const position: Position = {
    x: (event.clientX - rect.left - offset.value.x) / scale.value,
    y: (event.clientY - rect.top - offset.value.y) / scale.value
  };

  emit('canvasClick', position);
}

function handleWheel(event: WheelEvent): void {
  event.preventDefault();

  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  const newScale = Math.max(0.1, Math.min(3, scale.value + delta));

  setScale(newScale);
}

// 键盘事件监听
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeyDown);
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  overflow: hidden;
}

.controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.control-btn {
  width: 2rem;
  height: 2rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: #374151;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.control-btn:active {
  transform: translateY(0);
}

.zoom-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  min-width: 3.5rem;
  text-align: center;
}

.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  cursor: grab;
  user-select: none;
}

.canvas.panning {
  cursor: grabbing;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.nodes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.nodes > * {
  pointer-events: auto;
}

.help-info {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
.mobile .controls {
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.375rem;
  gap: 0.25rem;
}

.mobile .control-btn {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 1rem;
}

.mobile .zoom-info {
  font-size: 0.75rem;
  min-width: 3rem;
}

.mobile .help-info {
  bottom: 0.5rem;
  left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

/* 控制按钮尺寸 */
.controls.small .control-btn {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 1rem;
}

.controls.medium .control-btn {
  width: 2rem;
  height: 2rem;
  font-size: 1.125rem;
}

.controls.large .control-btn {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1.25rem;
}

/* 移动端触摸优化 */
.mobile .canvas {
  touch-action: pan-x pan-y;
}

.mobile .nodes {
  touch-action: none;
}

/* 横竖屏优化 */
.mobile.portrait .controls {
  top: auto;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  justify-content: center;
}

.mobile.portrait .help-info {
  bottom: 4rem;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .control-btn {
    border-width: 2px;
    font-weight: bold;
  }

  .node {
    border-width: 2px;
  }

  .connections line {
    stroke-width: 3px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .canvas-container {
    background: #1f2937;
  }

  .controls {
    background: rgba(31, 41, 55, 0.95);
  }

  .control-btn {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .control-btn:hover {
    background: #4b5563;
    border-color: #6b7280;
  }

  .zoom-info {
    color: #9ca3af;
  }

  .canvas {
    background: #111827;
  }

  .help-info {
    background: rgba(31, 41, 55, 0.95);
    color: #9ca3af;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .control-btn,
  .node,
  .canvas {
    transition: none;
  }
}

/* 无障碍支持 */
.control-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 键盘导航指示 */
.canvas:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}
</style>
