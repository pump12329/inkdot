/**
 * 思维导图交互逻辑组合式函数
 */

import type { MindMapNode, Position } from '@/types';
import { useMindMapStore } from '@/stores/mindmap';
import { mathUtils } from '@/utils';
import { ref, computed, readonly } from 'vue';

export function useMindMapInteraction() {
  const store = useMindMapStore();

  // 响应式状态
  const isDragging = ref(false);
  const dragOffset = ref<Position>({ x: 0, y: 0 });
  const selectedNodeId = ref<string | null>(null);
  const isConnecting = ref(false);
  const connectFromNodeId = ref<string | null>(null);

  // 计算属性
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null;
    return store.getNodeById(selectedNodeId.value);
  });

  const canConnect = computed(() => {
    return isConnecting.value && connectFromNodeId.value !== null;
  });

  // 方法
  function selectNode(nodeId: string | null): void {
    selectedNodeId.value = nodeId;
    if (nodeId) {
      store.selectNode(nodeId);
    } else {
      store.clearSelection();
    }
  }

  function startDrag(nodeId: string, offset: Position): void {
    isDragging.value = true;
    dragOffset.value = offset;
    selectNode(nodeId);
  }

  function stopDrag(): void {
    isDragging.value = false;
    dragOffset.value = { x: 0, y: 0 };
  }

  function updateNodePosition(nodeId: string, position: Position): void {
    store.updateNodePosition(nodeId, position);
  }

  function updateNodeContent(nodeId: string, content: string): void {
    store.updateNodeContent(nodeId, content);
  }

  function deleteSelectedNode(): void {
    if (selectedNodeId.value) {
      store.removeNode(selectedNodeId.value);
      selectedNodeId.value = null;
    }
  }

  function createNodeAtPosition(position: Position, content = '新节点'): string {
    const newNode = store.addNode({
      content,
      position,
      connections: []
    });
    selectNode(newNode.id);
    return newNode.id;
  }

  function startConnectMode(fromNodeId: string): void {
    isConnecting.value = true;
    connectFromNodeId.value = fromNodeId;
  }

  function completeConnection(toNodeId: string): boolean {
    if (isConnecting.value && connectFromNodeId.value && connectFromNodeId.value !== toNodeId) {
      const connection = store.addConnection(connectFromNodeId.value, toNodeId);
      isConnecting.value = false;
      connectFromNodeId.value = null;
      return connection !== null;
    }
    return false;
  }

  function cancelConnection(): void {
    isConnecting.value = false;
    connectFromNodeId.value = null;
  }

  function findNodeAtPosition(position: Position, nodes: MindMapNode[]): MindMapNode | null {
    const NODE_RADIUS = 30;

    for (const node of nodes) {
      const distance = mathUtils.distance(position.x, position.y, node.position.x, node.position.y);

      if (distance <= NODE_RADIUS) {
        return node;
      }
    }

    return null;
  }

  function isPositionValid(
    position: Position,
    canvasSize: { width: number; height: number }
  ): boolean {
    const NODE_RADIUS = 30;
    return (
      position.x >= NODE_RADIUS &&
      position.x <= canvasSize.width - NODE_RADIUS &&
      position.y >= NODE_RADIUS &&
      position.y <= canvasSize.height - NODE_RADIUS
    );
  }

  function constrainPosition(
    position: Position,
    canvasSize: { width: number; height: number }
  ): Position {
    const NODE_RADIUS = 30;
    return {
      x: mathUtils.clamp(position.x, NODE_RADIUS, canvasSize.width - NODE_RADIUS),
      y: mathUtils.clamp(position.y, NODE_RADIUS, canvasSize.height - NODE_RADIUS)
    };
  }

  return {
    // 状态
    isDragging: readonly(isDragging),
    dragOffset: readonly(dragOffset),
    selectedNodeId: readonly(selectedNodeId),
    selectedNode,
    isConnecting: readonly(isConnecting),
    connectFromNodeId: readonly(connectFromNodeId),
    canConnect,

    // 方法
    selectNode,
    startDrag,
    stopDrag,
    updateNodePosition,
    updateNodeContent,
    deleteSelectedNode,
    createNodeAtPosition,
    startConnectMode,
    completeConnection,
    cancelConnection,
    findNodeAtPosition,
    isPositionValid,
    constrainPosition
  };
}

// 导出类型
export type MindMapInteraction = ReturnType<typeof useMindMapInteraction>;
