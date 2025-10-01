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
        <Plus :size="18" :stroke-width="2" aria-hidden="true" />
      </button>
      <button class="control-btn" title="缩小 (-)" aria-label="缩小画布" @click="zoomOut">
        <Minus :size="18" :stroke-width="2" aria-hidden="true" />
      </button>
      <button
        class="control-btn"
        title="适应内容 (F)"
        aria-label="适应内容大小"
        @click="fitToContent()"
      >
        <Maximize :size="18" :stroke-width="2" aria-hidden="true" />
      </button>
      <button class="control-btn" title="重置视图 (0)" aria-label="重置视图" @click="resetZoom">
        <RotateCcw :size="18" :stroke-width="2" aria-hidden="true" />
      </button>
      <div class="zoom-info" role="status" aria-live="polite">{{ Math.round(scale * 100) }}%</div>
    </div>

    <!-- 画布 -->
    <div
      class="canvas"
      :class="{
        panning: isPanning,
        touching: isTouching,
        animating: isAnimating
      }"
      @click="handleCanvasClick"
      @mousedown="startPan"
      @wheel="handleWheel"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- 连接线层 -->
      <svg
        class="connections"
        :style="{ transform: transformStyle, transformOrigin: transformOrigin }"
      >
        <polyline
          v-for="connection in visibleConnections"
          :key="connection.id"
          :points="getConnectionPoints(connection.fromNodeId, connection.toNodeId)"
          :stroke="connectionStrokeColor"
          stroke-width="2"
          fill="none"
        />
      </svg>

      <!-- 节点层 -->
      <div class="nodes" :style="{ transform: transformStyle, transformOrigin: transformOrigin }">
        <MindMapNodeComponent
          v-for="node in visibleNodes"
          :key="node.id"
          :node="node"
          :is-selected="props.selectedNodeId === node.id"
          :has-children="hasChildren(node.id)"
          :is-expanded="!isNodeCollapsed(node.id)"
          @click="handleNodeClick"
          @update-content="handleNodeContentUpdate"
          @toggle-expand="handleToggleExpand"
        />
      </div>
    </div>

    <!-- 悬浮操作按钮栏 -->
    <FloatingActionBar
      :node="selectedNodeInfo"
      :is-visible="showFloatingBar"
      :has-children="selectedNodeHasChildren"
      :is-expanded="isNodeExpanded"
      @add-root-node="handleAddRootNode"
      @add-child="handleAddChild"
      @edit="handleEditNode"
      @copy="handleCopyNode"
      @delete="handleDeleteNode"
      @toggle-expand="handleToggleExpand"
      @import="handleImport"
      @export="handleExport"
      @reset-zoom="handleResetZoom"
      @toggle-theme="handleToggleTheme"
      @close="closeFloatingBar"
    />

    <!-- 帮助信息 -->
    <div class="help-info" role="status" aria-live="polite">
      <span v-if="isPanning">正在平移画布...</span>
      <span v-else-if="scale !== 1">缩放: {{ Math.round(scale * 100) }}%</span>
      <span v-else>按住空白区域拖动画布，使用左上角按钮创建节点</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MindMapNode, NodeConnection, Position } from '@/types';
import MindMapNodeComponent from './MindMapNode.vue';
import FloatingActionBar from './FloatingActionBar.vue';
import { useCanvasView } from '@/composables/useCanvasView';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import { Plus, Minus, Maximize, RotateCcw } from 'lucide-vue-next';
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

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

// 悬浮按钮栏状态 - 始终显示
const showFloatingBar = ref(true);
const selectedNodeForBar = ref<MindMapNode | null>(null);
const expandedNodes = ref<Set<string>>(new Set());

// 计算选中的节点信息
const selectedNodeInfo = computed(() => {
  if (!props.selectedNodeId) return null;
  return props.nodes.find(node => node.id === props.selectedNodeId) || null;
});

// 计算选中节点是否有子节点
const selectedNodeHasChildren = computed(() => {
  if (!selectedNodeInfo.value) return false;
  return props.connections.some(conn => conn.fromNodeId === selectedNodeInfo.value?.id);
});

// 计算节点是否展开
const isNodeExpanded = computed(() => {
  if (!selectedNodeInfo.value) return false;
  return expandedNodes.value.has(selectedNodeInfo.value.id);
});

// 连接线颜色计算
const connectionStrokeColor = computed(() => {
  return 'var(--color-border-tertiary, #d1d5db)';
});

// 可见连接线（过滤掉被折叠节点的连接）
const visibleConnections = computed(() => {
  return props.connections.filter(connection => {
    const fromNode = props.nodes.find(n => n.id === connection.fromNodeId);
    const toNode = props.nodes.find(n => n.id === connection.toNodeId);

    // 如果源节点或目标节点不存在，不显示连接
    if (!fromNode || !toNode) return false;

    // 如果源节点被折叠，不显示其子节点的连接
    if (isNodeCollapsed(fromNode.id)) return false;

    return true;
  });
});

// 检查节点是否被折叠
function isNodeCollapsed(nodeId: string): boolean {
  const node = props.nodes.find(n => n.id === nodeId);
  return node?.connections.includes('collapsed') || false;
}

// 可见节点（过滤掉被折叠节点的子节点）
const visibleNodes = computed(() => {
  const visible = new Set<string>();

  function addVisibleNodes(nodeId: string) {
    const node = props.nodes.find(n => n.id === nodeId);
    if (!node) return;

    visible.add(nodeId);

    // 如果节点未被折叠，添加其子节点
    if (!isNodeCollapsed(nodeId)) {
      const childConnections = props.connections.filter(conn => conn.fromNodeId === nodeId);
      childConnections.forEach(conn => {
        addVisibleNodes(conn.toNodeId);
      });
    }
  }

  // 找到根节点（没有父节点的节点）
  const rootNodes = props.nodes.filter(
    node => !props.connections.some(conn => conn.toNodeId === node.id)
  );

  // 从根节点开始遍历
  rootNodes.forEach(rootNode => {
    addVisibleNodes(rootNode.id);
  });

  return Array.from(visible)
    .map(id => props.nodes.find(n => n.id === id))
    .filter((node): node is MindMapNode => Boolean(node));
});

// 获取折线连接点
function getConnectionPoints(fromNodeId: string, toNodeId: string): string {
  const fromNode = props.nodes.find(n => n.id === fromNodeId);
  const toNode = props.nodes.find(n => n.id === toNodeId);

  if (!fromNode || !toNode) return '';

  const nodeWidth = 120; // 节点宽度
  const nodeHeight = 48; // 节点高度

  // 计算连接点
  const fromX = fromNode.position.x + nodeWidth;
  const fromY = fromNode.position.y + nodeHeight / 2;
  const toX = toNode.position.x;
  const toY = toNode.position.y + nodeHeight / 2;

  // 计算中间点，创建折线效果
  const midX = (fromX + toX) / 2;

  // 返回折线点：起点 -> 中间点 -> 终点
  return `${fromX},${fromY} ${midX},${fromY} ${midX},${toY} ${toX},${toY}`;
}

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
  addChildNode: [parentId: string, position: Position];
  copyNode: [nodeId: string];
  deleteNode: [nodeId: string];
  toggleNodeExpand: [nodeId: string];
  import: [];
  export: [];
  resetZoom: [];
  toggleTheme: [];
}>();

// 使用画布视图管理
const {
  scale,
  offset,
  isPanning,
  isTouching,
  isAnimating,
  transformStyle,
  transformOrigin,
  zoomIn,
  zoomOut,
  setScale,
  resetZoom,
  fitToContent,
  updateContentSize,
  startPan,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleKeyDown
} = useCanvasView();

// 方法
function handleToggleExpand(nodeId: string): void {
  emit('toggleNodeExpand', nodeId);
}

function hasChildren(nodeId: string): boolean {
  return props.connections.some(conn => conn.fromNodeId === nodeId);
}

function handleNodeClick(nodeId: string): void {
  emit('nodeClick', nodeId);

  // 显示悬浮按钮栏
  const clickedNode = props.nodes.find(node => node.id === nodeId);
  if (clickedNode) {
    selectedNodeForBar.value = clickedNode;
    showFloatingBar.value = true;
  }
}

function handleNodeContentUpdate(nodeId: string, content: string): void {
  emit('nodeContentUpdate', nodeId, content);
}

function handleCanvasClick(event: MouseEvent): void {
  // 如果正在平移，不创建新节点
  if (isPanning.value) return;

  // 关闭悬浮按钮栏
  closeFloatingBar();

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

// 悬浮按钮栏操作处理函数
function handleAddRootNode(): void {
  // 在画布中心创建根节点
  const rootPosition: Position = {
    x: 400,
    y: 300
  };

  emit('canvasClick', rootPosition);
}

function handleAddChild(nodeId: string): void {
  if (!selectedNodeInfo.value) return;

  // 在父节点附近创建子节点
  const childPosition: Position = {
    x: selectedNodeInfo.value.position.x + 150,
    y: selectedNodeInfo.value.position.y + 80
  };

  emit('addChildNode', nodeId, childPosition);
  closeFloatingBar();
}

function handleEditNode(nodeId: string): void {
  // 触发节点编辑模式（通过 MindMapNode 组件实现）
  const nodeElement = document.querySelector(
    `[data-node-id="${nodeId}"] .node-content`
  ) as HTMLElement;
  if (nodeElement) {
    nodeElement.click(); // 触发编辑模式
  }
  closeFloatingBar();
}

function handleCopyNode(nodeId: string): void {
  emit('copyNode', nodeId);
  closeFloatingBar();
}

function handleDeleteNode(nodeId: string): void {
  emit('deleteNode', nodeId);
  closeFloatingBar();
}

function handleImport(): void {
  emit('import');
}

function handleExport(): void {
  emit('export');
}

function handleResetZoom(): void {
  resetZoom();
}

function handleToggleTheme(): void {
  emit('toggleTheme');
}

function closeFloatingBar(): void {
  showFloatingBar.value = false;
  selectedNodeForBar.value = null;
}

// 监听选中节点变化
watch(
  () => props.selectedNodeId,
  newNodeId => {
    if (!newNodeId) {
      selectedNodeForBar.value = null;
    } else {
      const node = props.nodes.find(n => n.id === newNodeId);
      if (node) {
        selectedNodeForBar.value = node;
      }
    }
  }
);

// 监听节点删除
watch(
  () => props.nodes,
  newNodes => {
    if (selectedNodeInfo.value && !newNodes.some(n => n.id === selectedNodeInfo.value?.id)) {
      closeFloatingBar();
    }
  },
  { deep: true }
);

// 键盘快捷键支持
function handleGlobalKeyDown(event: KeyboardEvent): void {
  if (!showFloatingBar.value) return;

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeFloatingBar();
      break;
    case 'Delete':
      if (selectedNodeInfo.value) {
        event.preventDefault();
        handleDeleteNode(selectedNodeInfo.value.id);
      }
      break;
  }
}

// 全局键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
});

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
  background: var(--color-background, #f8f9fa);
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-surface, rgba(255, 255, 255, 0.95));
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md, 0 2px 8px rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.control-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary, #374151);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  overflow: hidden;
}

.control-btn:hover:not(:disabled) {
  background: var(--color-surface-hover, #f9fafb);
  border-color: var(--color-border-hover, #d1d5db);
  color: var(--color-text-primary, #111827);
  transform: translateY(-1px);
  box-shadow: var(
    --shadow-md,
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06)
  );
}

.control-btn:focus-visible:not(:disabled) {
  outline: 2px solid var(--color-primary-default, #3b82f6);
  outline-offset: 2px;
  z-index: 1;
}

.control-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.zoom-info {
  font-size: 0.875rem;
  color: var(--color-text-tertiary, #6b7280);
  font-weight: 500;
  min-width: 3.5rem;
  text-align: center;
  transition: color 0.3s ease;
}

.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-background, #ffffff);
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: background-color 0.3s ease;
}

.canvas.panning {
  cursor: grabbing;
}

.canvas.touching {
  cursor: grab;
}

.canvas.animating {
  cursor: grab;
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
  background: var(--color-surface, rgba(255, 255, 255, 0.95));
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text-tertiary, #6b7280);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
  transition: all 0.3s ease;
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
  color: var(--color-text-tertiary, #6b7280);
}

/* 控制按钮尺寸 */
.controls.small .control-btn {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.controls.medium .control-btn {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.controls.large .control-btn {
  width: 48px;
  height: 48px;
  font-size: 18px;
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

  .connections line {
    stroke-width: 3px;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  /* 使用CSS变量，无需额外覆盖 */
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
