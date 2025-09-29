import type { MindMapNode, NodeConnection, Position } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// 简单的ID生成器
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const useMindMapStore = defineStore('mindMap', () => {
  // 状态
  const nodes = ref<MindMapNode[]>([]);
  const connections = ref<NodeConnection[]>([]);
  const selectedNodeId = ref<string | null>(null);
  const isModified = ref(false);

  // 计算属性
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null;
    return nodes.value.find(node => node.id === selectedNodeId.value) || null;
  });

  // 核心操作
  function addNode(nodeData: Omit<MindMapNode, 'id'>): MindMapNode {
    const newNode: MindMapNode = {
      id: generateId(),
      content: nodeData.content,
      position: nodeData.position,
      connections: []
    };

    nodes.value.push(newNode);
    isModified.value = true;
    return newNode;
  }

  function updateNode(nodeId: string, updates: Partial<MindMapNode>): void {
    const nodeIndex = nodes.value.findIndex(node => node.id === nodeId);
    if (nodeIndex === -1) return;

    nodes.value[nodeIndex] = { ...nodes.value[nodeIndex], ...updates };
    isModified.value = true;
  }

  function updateNodePosition(nodeId: string, position: Position): void {
    updateNode(nodeId, { position });
  }

  function updateNodeContent(nodeId: string, content: string): void {
    updateNode(nodeId, { content });
  }

  function removeNode(nodeId: string): void {
    const nodeIndex = nodes.value.findIndex(node => node.id === nodeId);
    if (nodeIndex === -1) return;

    nodes.value.splice(nodeIndex, 1);

    // 移除相关连接
    connections.value = connections.value.filter(
      conn => conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    );

    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null;
    }

    isModified.value = true;
  }

  function addConnection(fromNodeId: string, toNodeId: string): void {
    // 检查是否已存在连接
    const exists = connections.value.some(
      conn =>
        (conn.fromNodeId === fromNodeId && conn.toNodeId === toNodeId) ||
        (conn.fromNodeId === toNodeId && conn.toNodeId === fromNodeId)
    );

    if (!exists) {
      connections.value.push({
        id: generateId(),
        fromNodeId,
        toNodeId
      });
      isModified.value = true;
    }
  }

  function selectNode(nodeId: string | null): void {
    selectedNodeId.value = nodeId;
  }

  function createNewProject(): void {
    nodes.value = [];
    connections.value = [];
    selectedNodeId.value = null;
    isModified.value = false;
  }

  function saveCurrentProject(): void {
    // 简化的保存 - 保存到localStorage
    const data = {
      nodes: nodes.value,
      connections: connections.value,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('inkdot-project', JSON.stringify(data));
    isModified.value = false;
    console.log('项目已保存');
  }

  function loadProject(): void {
    // 简化的加载 - 从localStorage加载
    const saved = localStorage.getItem('inkdot-project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        nodes.value = data.nodes || [];
        connections.value = data.connections || [];
        selectedNodeId.value = null;
        isModified.value = false;
        console.log('项目已加载');
      } catch (e) {
        console.error('加载项目失败:', e);
      }
    }
  }

  // 计算内容尺寸
  function getContentSize(): { width: number; height: number } {
    if (nodes.value.length === 0) {
      return { width: 800, height: 600 };
    }

    let maxX = 0;
    let maxY = 0;

    nodes.value.forEach(node => {
      maxX = Math.max(maxX, node.position.x + 200);
      maxY = Math.max(maxY, node.position.y + 60);
    });

    return {
      width: Math.max(800, maxX + 100),
      height: Math.max(600, maxY + 100)
    };
  }

  // 树状布局计算
  function calculateTreeLayout(): void {
    if (nodes.value.length === 0) return;

    // 找到根节点（没有父节点的节点）
    const rootNodes = nodes.value.filter(
      node => !connections.value.some(conn => conn.toNodeId === node.id)
    );

    if (rootNodes.length === 0 && nodes.value.length > 0) {
      // 如果没有明确的根节点，选择第一个节点作为根节点
      rootNodes.push(nodes.value[0]);
    }

    // 清除所有节点位置
    nodes.value.forEach(node => {
      node.position = { x: 0, y: 0 };
    });

    // 布局参数
    const layout = {
      levelHeight: 120,
      nodeWidth: 200,
      nodeHeight: 60,
      horizontalSpacing: 40,
      verticalSpacing: 80,
      startX: 50,
      startY: 50
    };

    // 计算每个层级的宽度
    const levelWidths: { [level: number]: number } = {};

    function calculateLevelWidth(nodeId: string, level: number): number {
      const childNodes = connections.value
        .filter(conn => conn.fromNodeId === nodeId)
        .map(conn => conn.toNodeId);

      if (childNodes.length === 0) {
        return layout.nodeWidth;
      }

      const childrenWidth = childNodes.reduce((sum, childId) => {
        return sum + calculateLevelWidth(childId, level + 1);
      }, 0);

      const totalWidth = Math.max(
        layout.nodeWidth,
        childrenWidth + (childNodes.length - 1) * layout.horizontalSpacing
      );

      levelWidths[level] = Math.max(levelWidths[level] || 0, totalWidth);
      return totalWidth;
    }

    // 计算每个层级的宽度
    rootNodes.forEach(rootNode => {
      calculateLevelWidth(rootNode.id, 0);
    });

    // 布局节点
    let currentX = layout.startX;
    rootNodes.forEach(rootNode => {
      const treeWidth = calculateLevelWidth(rootNode.id, 0);
      positionNodeInTree(rootNode.id, 0, currentX, layout.startY, layout, levelWidths);
      currentX += treeWidth + layout.horizontalSpacing;
    });
  }

  // 递归设置节点位置
  function positionNodeInTree(
    nodeId: string,
    level: number,
    startX: number,
    startY: number,
    layout: any,
    levelWidths: { [level: number]: number }
  ): void {
    const node = nodes.value.find(n => n.id === nodeId);
    if (!node) return;

    // 设置节点位置
    node.position = {
      x: startX + (levelWidths[level] - layout.nodeWidth) / 2,
      y: startY + level * (layout.nodeHeight + layout.verticalSpacing)
    };

    // 获取子节点
    const childNodes = connections.value
      .filter(conn => conn.fromNodeId === nodeId)
      .map(conn => conn.toNodeId);

    if (childNodes.length === 0) return;

    // 计算子节点总宽度
    const childrenTotalWidth =
      childNodes.length * layout.nodeWidth + (childNodes.length - 1) * layout.horizontalSpacing;

    // 计算子节点起始位置
    let childStartX = startX + (levelWidths[level] - childrenTotalWidth) / 2;

    // 递归处理子节点
    childNodes.forEach(childId => {
      positionNodeInTree(childId, level + 1, childStartX, startY, layout, levelWidths);
      childStartX += layout.nodeWidth + layout.horizontalSpacing;
    });
  }

  // 返回公共接口
  return {
    // 状态
    nodes,
    connections,
    selectedNode,
    isModified,

    // 操作方法
    addNode,
    updateNodePosition,
    updateNodeContent,
    removeNode,
    addConnection,
    selectNode,
    createNewProject,
    saveCurrentProject,
    loadProject,
    calculateTreeLayout,
    getContentSize
  };
});
