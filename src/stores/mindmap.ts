import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { MindMapNode, NodeConnection, Project, Position } from '@/types';
import { generateId } from '@/utils';

export const useMindMapStore = defineStore('mindMap', () => {
  // 状态
  const nodes = ref<MindMapNode[]>([]);
  const connections = ref<NodeConnection[]>([]);
  const selectedNodeId = ref<string | null>(null);
  const currentProject = ref<Project | null>(null);
  const isModified = ref(false);

  // 计算属性
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null;
    return nodes.value.find(node => node.id === selectedNodeId.value) || null;
  });

  const nodeCount = computed(() => nodes.value.length);
  const connectionCount = computed(() => connections.value.length);

  // 操作
  function addNode(nodeData: Omit<MindMapNode, 'id'>): MindMapNode {
    const newNode: MindMapNode = {
      id: generateId(),
      content: nodeData.content,
      position: { ...nodeData.position },
      connections: [...nodeData.connections]
    };

    nodes.value.push(newNode);
    isModified.value = true;
    return newNode;
  }

  function updateNode(nodeId: string, updates: Partial<Omit<MindMapNode, 'id'>>): void {
    const nodeIndex = nodes.value.findIndex(node => node.id === nodeId);
    if (nodeIndex === -1) return;

    const currentNode = nodes.value[nodeIndex];
    nodes.value[nodeIndex] = {
      ...currentNode,
      ...updates,
      id: nodeId // 确保ID不被覆盖
    };

    isModified.value = true;
  }

  function updateNodePosition(nodeId: string, position: Position): void {
    updateNode(nodeId, { position });
  }

  function updateNodeContent(nodeId: string, content: string): void {
    updateNode(nodeId, { content });
  }

  function removeNode(nodeId: string): void {
    // 移除节点
    const nodeIndex = nodes.value.findIndex(node => node.id === nodeId);
    if (nodeIndex === -1) return;

    nodes.value.splice(nodeIndex, 1);

    // 移除相关连接
    connections.value = connections.value.filter(
      connection => connection.fromNodeId !== nodeId && connection.toNodeId !== nodeId
    );

    // 如果删除的是选中节点，清除选择
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null;
    }

    isModified.value = true;
  }

  function addConnection(fromNodeId: string, toNodeId: string): NodeConnection | null {
    // 检查节点是否存在
    const fromNode = nodes.value.find(node => node.id === fromNodeId);
    const toNode = nodes.value.find(node => node.id === toNodeId);

    if (!fromNode || !toNode) return null;

    // 检查连接是否已存在
    const existingConnection = connections.value.find(
      connection =>
        (connection.fromNodeId === fromNodeId && connection.toNodeId === toNodeId) ||
        (connection.fromNodeId === toNodeId && connection.toNodeId === fromNodeId)
    );

    if (existingConnection) return null;

    const newConnection: NodeConnection = {
      id: generateId(),
      fromNodeId,
      toNodeId
    };

    connections.value.push(newConnection);
    isModified.value = true;
    return newConnection;
  }

  function removeConnection(connectionId: string): void {
    const connectionIndex = connections.value.findIndex(
      connection => connection.id === connectionId
    );

    if (connectionIndex !== -1) {
      connections.value.splice(connectionIndex, 1);
      isModified.value = true;
    }
  }

  function selectNode(nodeId: string | null): void {
    selectedNodeId.value = nodeId;
  }

  function clearSelection(): void {
    selectedNodeId.value = null;
  }

  function createNewProject(name = '新项目'): void {
    currentProject.value = {
      id: generateId(),
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 清空当前数据
    nodes.value = [];
    connections.value = [];
    selectedNodeId.value = null;
    isModified.value = false;
  }

  function saveCurrentProject(): void {
    if (!currentProject.value) return;

    const projectData = {
      ...currentProject.value,
      updatedAt: new Date(),
      nodes: nodes.value,
      connections: connections.value
    };

    // 这里应该调用实际的保存服务
    console.log('保存项目:', projectData);

    isModified.value = false;
  }

  function loadProject(
    project: Project & { nodes: MindMapNode[]; connections: NodeConnection[] }
  ): void {
    currentProject.value = {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    nodes.value = [...project.nodes];
    connections.value = [...project.connections];
    selectedNodeId.value = null;
    isModified.value = false;
  }

  function clearProject(): void {
    currentProject.value = null;
    nodes.value = [];
    connections.value = [];
    selectedNodeId.value = null;
    isModified.value = false;
  }

  function getNodeById(nodeId: string): MindMapNode | null {
    return nodes.value.find(node => node.id === nodeId) || null;
  }

  function getConnectedNodes(nodeId: string): MindMapNode[] {
    const connectedNodeIds = new Set<string>();

    connections.value.forEach(connection => {
      if (connection.fromNodeId === nodeId) {
        connectedNodeIds.add(connection.toNodeId);
      } else if (connection.toNodeId === nodeId) {
        connectedNodeIds.add(connection.fromNodeId);
      }
    });

    return Array.from(connectedNodeIds)
      .map(id => getNodeById(id))
      .filter((node): node is MindMapNode => node !== null);
  }

  function exportData(): {
    project: Project | null;
    nodes: MindMapNode[];
    connections: NodeConnection[];
  } {
    return {
      project: currentProject.value ? { ...currentProject.value } : null,
      nodes: [...nodes.value],
      connections: [...connections.value]
    };
  }

  function importData(data: {
    project?: Project;
    nodes: MindMapNode[];
    connections: NodeConnection[];
  }): void {
    if (data.project) {
      currentProject.value = { ...data.project };
    }

    nodes.value = [...data.nodes];
    connections.value = [...data.connections];
    selectedNodeId.value = null;
    isModified.value = false;
  }

  // 返回公共接口
  return {
    // 只读状态
    nodes: readonly(nodes),
    connections: readonly(connections),
    selectedNode,
    selectedNodeId: readonly(selectedNodeId),
    currentProject: readonly(currentProject),
    isModified: readonly(isModified),
    nodeCount,
    connectionCount,

    // 操作方法
    addNode,
    updateNode,
    updateNodePosition,
    updateNodeContent,
    removeNode,
    addConnection,
    removeConnection,
    selectNode,
    clearSelection,
    createNewProject,
    saveCurrentProject,
    loadProject,
    clearProject,
    getNodeById,
    getConnectedNodes,
    exportData,
    importData
  };
});
