<template>
  <div class="mindmap-canvas-container">
    <!-- SVG画布用于绘制连接线 -->
    <svg class="connections-layer" :width="canvasSize.width" :height="canvasSize.height">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#00000044" />
        </marker>
      </defs>

      <!-- 连接线 -->
      <line
        v-for="connection in connections"
        :key="connection.id"
        :x1="getNodePosition(connection.fromNodeId).x"
        :y1="getNodePosition(connection.fromNodeId).y"
        :x2="getNodePosition(connection.toNodeId).x"
        :y2="getNodePosition(connection.toNodeId).y"
        stroke="#00000044"
        stroke-width="2"
        marker-end="url(#arrowhead)"
        class="connection-line"
      />
    </svg>

    <!-- 节点层 -->
    <div
      class="nodes-layer"
      @click="handleCanvasClick"
      @mousedown="handleCanvasMouseDown"
      @mousemove="handleCanvasMouseMove"
      @mouseup="handleCanvasMouseUp"
    >
      <MindMapNodeComponent
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :is-selected="selectedNodeId === node.id"
        :is-dragging="draggingNodeId === node.id"
        :scale="scale"
        @click="handleNodeClick"
        @double-click="handleNodeDoubleClick"
        @mouse-down="handleNodeMouseDown"
        @update-content="handleNodeContentUpdate"
      />
    </div>

    <!-- 网格背景（可选） -->
    <div v-if="showGrid" class="grid-background" :style="gridStyle" />
  </div>
</template>

<script setup lang="ts">
import type { MindMapNode, NodeConnection, Position } from '@/types';
import { computed, ref } from 'vue';
import MindMapNodeComponent from './MindMapNode.vue';

// Props
interface Props {
  nodes: MindMapNode[];
  connections: NodeConnection[];
  selectedNodeId?: string | null;
  showGrid?: boolean;
  scale?: number;
  canvasSize?: { width: number; height: number };
}

const props = withDefaults(defineProps<Props>(), {
  selectedNodeId: null,
  showGrid: false,
  scale: 1,
  canvasSize: () => ({ width: 800, height: 600 })
});

// Emits
const emit = defineEmits<{
  nodeClick: [nodeId: string, event: MouseEvent];
  nodeDoubleClick: [nodeId: string];
  nodeContentUpdate: [nodeId: string, content: string];
  nodePositionUpdate: [nodeId: string, position: Position];
  canvasClick: [position: Position, event: MouseEvent];
  selectionChange: [nodeId: string | null];
}>();

// 响应式数据
const draggingNodeId = ref<string | null>(null);
const dragOffset = ref<Position>({ x: 0, y: 0 });
const isDragging = ref(false);

// 计算属性
const gridStyle = computed(() => ({
  backgroundImage: `
    linear-gradient(to right, #00000008 1px, transparent 1px),
    linear-gradient(to bottom, #00000008 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px'
}));

// 方法
function getNodePosition(nodeId: string): Position {
  const node = props.nodes.find(n => n.id === nodeId);
  return node ? node.position : { x: 0, y: 0 };
}

function handleNodeClick(nodeId: string, event: MouseEvent): void {
  emit('nodeClick', nodeId, event);
  emit('selectionChange', nodeId);
}

function handleNodeDoubleClick(nodeId: string): void {
  emit('nodeDoubleClick', nodeId);
}

function handleNodeMouseDown(nodeId: string, event: MouseEvent): void {
  event.stopPropagation();

  const node = props.nodes.find(n => n.id === nodeId);
  if (!node) return;

  draggingNodeId.value = nodeId;
  isDragging.value = true;

  // 计算拖拽偏移量
  dragOffset.value = {
    x: event.clientX - node.position.x,
    y: event.clientY - node.position.y
  };

  emit('selectionChange', nodeId);
}

function handleNodeContentUpdate(nodeId: string, content: string): void {
  emit('nodeContentUpdate', nodeId, content);
}

function handleCanvasClick(event: MouseEvent): void {
  // 只在点击空白区域时处理
  if (event.target === event.currentTarget) {
    const _rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const position: Position = {
      x: event.clientX - _rect.left,
      y: event.clientY - _rect.top
    };

    emit('canvasClick', position, event);
    emit('selectionChange', null);
  }
}

function handleCanvasMouseDown(event: MouseEvent): void {
  // 在空白区域点击时清除选择
  if (event.target === event.currentTarget) {
    emit('selectionChange', null);
  }
}

function handleCanvasMouseMove(event: MouseEvent): void {
  if (!isDragging.value || !draggingNodeId.value) return;

  const _rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const newPosition: Position = {
    x: event.clientX - _rect.left - dragOffset.value.x,
    y: event.clientY - _rect.top - dragOffset.value.y
  };

  // 限制在画布范围内
  newPosition.x = Math.max(30, Math.min(props.canvasSize.width - 30, newPosition.x));
  newPosition.y = Math.max(30, Math.min(props.canvasSize.height - 30, newPosition.y));

  emit('nodePositionUpdate', draggingNodeId.value, newPosition);
}

function handleCanvasMouseUp(): void {
  isDragging.value = false;
  draggingNodeId.value = null;
  dragOffset.value = { x: 0, y: 0 };
}
</script>

<style scoped>
.mindmap-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  user-select: none;
}

.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.nodes-layer {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: crosshair;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.connection-line {
  transition: stroke 0.2s ease;
}

.connection-line:hover {
  stroke: #000000;
  stroke-width: 3;
}

/* 拖拽时的样式 */
.nodes-layer.dragging {
  cursor: grabbing;
}
</style>
